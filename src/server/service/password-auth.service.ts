import { db } from '@/db';
import { authUsers, users, UserStatus } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from 'lucia';
import { createDate, TimeSpan } from 'oslo';
import { passwordUtils } from '@/lib/utils/password';
import { mfaUtils } from '@/lib/utils/mfa';
import { lucia } from '@/auth';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/utils/email';
import { render } from '@react-email/render';
import AuthenticationEmail from '@/email-templates/authentication-email';
import { env } from '@/env.mjs';

export const PasswordAuthService = {
    signup: async (data: {
        email: string;
        password: string;
        name: string;
    }) => {
        try {
            const existingAuthUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.email, data.email),
            });

            if (existingAuthUser) {
                return { ok: false, error: 'User already exists' };
            }

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, data.email),
            });

            if (existingUser) {
                return { ok: false, error: 'Email already registered' };
            }

            const passwordValidation = passwordUtils.isStrong(data.password);
            if (!passwordValidation.isValid) {
                return { ok: false, error: passwordValidation.message };
            }

            const passwordHash = await passwordUtils.hash(data.password);

            // ✅ CHANGED: Generate token but DON'T send email yet
            const verificationToken = generateId(40);
            const verificationTokenExpiresAt = createDate(new TimeSpan(24, 'h'));

            const [authUser] = await db
                .insert(authUsers)
                .values({
                    email: data.email,
                    passwordHash,
                    verificationToken,
                    verificationTokenExpiresAt,
                    isVerified: false,
                    // Don't set encryptionKey yet - will be set in encryption setup
                })
                .returning();

            const [user] = await db
                .insert(users)
                .values({
                    email: data.email,
                    name: data.name,
                    status: UserStatus.Inactive,
                    emailVerified: false,
                })
                .returning();

            await db
                .update(authUsers)
                .set({ userId: user.id })
                .where(eq(authUsers.id, authUser.id));

            // ❌ REMOVED: Don't send verification email during signup
            // const verificationLink = `${env.SITE_URL}/auth/verify-email?token=${verificationToken}`;
            // const html = await render(AuthenticationEmail(verificationLink));
            // await sendEmail({...});

            console.log('✅ User created successfully (email will be sent at login)');

            // Return both userId and authUserId for encryption setup
            return {
                ok: true,
                userId: user.id,
                authUserId: authUser.id,
            };
        } catch (error) {
            console.error('Signup error:', error);
            return { ok: false, error: 'Failed to create account' };
        }
    },
    verifyEmail: async (token: string) => {
        try {
            const authUser = await db.query.authUsers.findFirst({
                where: and(
                    eq(authUsers.verificationToken, token),
                    eq(authUsers.isVerified, false)
                ),
            });

            if (!authUser) {
                return { ok: false, error: 'Invalid or expired verification token' };
            }

            if (
                authUser.verificationTokenExpiresAt &&
                new Date() > authUser.verificationTokenExpiresAt
            ) {
                return { ok: false, error: 'Verification token has expired' };
            }

            await db
                .update(authUsers)
                .set({
                    isVerified: true,
                    verificationToken: null,
                    verificationTokenExpiresAt: null,
                })
                .where(eq(authUsers.id, authUser.id));

            if (authUser.userId) {
                await db
                    .update(users)
                    .set({
                        emailVerified: true,
                        status: UserStatus.Active,
                    })
                    .where(eq(users.id, authUser.userId));
            }

            return { ok: true };
        } catch (error) {
            console.error('Email verification error:', error);
            return { ok: false, error: 'Failed to verify email' };
        }
    },

    login: async (data: { email: string; password: string }) => {
        try {
            // Step 1: Check if user exists
            const authUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.email, data.email),
            });

            // User doesn't exist
            if (!authUser) {
                return {
                    ok: false,
                    error: "No account found",
                    errorType: 'no_account',
                    message: "No account found with this email. Please sign up first."
                };
            }

            // Step 2: Check password
            const isValidPassword = await passwordUtils.verify(
                data.password,
                authUser.passwordHash
            );

            // Wrong password
            if (!isValidPassword) {
                return {
                    ok: false,
                    error: 'Incorrect password',
                    errorType: 'wrong_password',
                    message: 'The password you entered is incorrect.'
                };
            }

            // Step 3: Check if encryption is set up
            if (!authUser.encryptionKey) {
                return {
                    ok: true,
                    needsEncryptionSetup: true,
                    authUserId: authUser.id,
                    userId: authUser.userId,
                    userEmail: authUser.email,
                    message: 'Please complete encryption setup'
                };
            }

            // Step 4: Check if MFA enabled
            if (authUser.mfaEnabled) {
                const mfaToken = generateId(40);
                return {
                    ok: true,
                    needsMfa: true,
                    mfaToken,
                    userId: authUser.userId,
                    userEmail: authUser.email,
                };
            }

            // ✅ NEW: Step 5: Check if email is verified
            if (!authUser.isVerified) {
                console.log('📧 User not verified, sending magic link email...');

                // Generate new token if needed (in case old one expired)
                let token = authUser.verificationToken;
                if (!token || (authUser.verificationTokenExpiresAt && new Date() > authUser.verificationTokenExpiresAt)) {
                    console.log('🔄 Generating new verification token...');
                    token = generateId(40);
                    const expiresAt = createDate(new TimeSpan(24, 'h'));

                    await db
                        .update(authUsers)
                        .set({
                            verificationToken: token,
                            verificationTokenExpiresAt: expiresAt,
                        })
                        .where(eq(authUsers.id, authUser.id));
                }

                // ✅ NEW: Send magic link email HERE (during login)
                const verificationLink = `${env.SITE_URL}/auth/verify-email?token=${token}`;
                const html = await render(AuthenticationEmail(verificationLink));

                try {
                    await sendEmail({
                        to: authUser.email,
                        subject: 'Verify your email and login',
                        html,
                    });
                    console.log('✅ Magic link sent to:', authUser.email);
                } catch (emailError) {
                    console.error('❌ Failed to send email:', emailError);
                    return {
                        ok: false,
                        error: 'Failed to send verification email',
                        errorType: 'email_error',
                        message: 'Could not send verification email. Please try again.'
                    };
                }

                return {
                    ok: true,
                    needsEmailVerification: true, // ✅ NEW FLAG
                    userEmail: authUser.email,
                    message: 'Check your email for login link'
                };
            }

            // ✅ Step 6: If verified, create session and login
            if (authUser.userId) {
                const user = await db.query.users.findFirst({
                    where: eq(users.id, authUser.userId),
                });

                if (!user) {
                    return { ok: false, error: 'User not found' };
                }

                const session = await lucia.createSession(user.id, {});
                const sessionCookie = lucia.createSessionCookie(session.id);
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );

                return {
                    ok: true,
                    userId: user.id,
                    userEmail: authUser.email,
                    message: 'Login successful',
                    loggedIn: true, // ✅ NEW FLAG to indicate user is logged in
                };
            }

            return {
                ok: false,
                error: 'Login failed',
                errorType: 'server_error',
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                ok: false,
                error: 'Login failed',
                errorType: 'server_error',
                message: 'An unexpected error occurred.'
            };
        }
    },

    // ... rest of the functions stay the same ...
    verifyMfaAndLogin: async (data: {
        mfaToken: string;
        code: string;
        userId: string;
    }) => {
        try {
            const authUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.userId, data.userId),
            });

            if (!authUser || !authUser.mfaSecret || !authUser.mfaEnabled) {
                return { ok: false, error: 'MFA not enabled for this account' };
            }

            const isValidCode = mfaUtils.verifyToken(data.code, authUser.mfaSecret);

            if (!isValidCode) {
                if (authUser.mfaBackupCodes) {
                    const backupCodes = JSON.parse(authUser.mfaBackupCodes);
                    const backupCodeVerification = await mfaUtils.verifyBackupCode(
                        data.code,
                        backupCodes
                    );

                    if (!backupCodeVerification.isValid) {
                        return { ok: false, error: 'Invalid MFA code' };
                    }

                    backupCodes.splice(backupCodeVerification.codeIndex, 1);
                    await db
                        .update(authUsers)
                        .set({ mfaBackupCodes: JSON.stringify(backupCodes) })
                        .where(eq(authUsers.id, authUser.id));
                } else {
                    return { ok: false, error: 'Invalid MFA code' };
                }
            }

            const user = await db.query.users.findFirst({
                where: eq(users.id, data.userId),
            });

            if (!user) {
                return { ok: false, error: 'User not found' };
            }

            const session = await lucia.createSession(user.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );

            return { ok: true, userId: user.id };
        } catch (error) {
            console.error('MFA verification error:', error);
            return { ok: false, error: 'Failed to verify MFA code' };
        }
    },

    enableMfa: async (userId: string) => {
        try {
            const authUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.userId, userId),
            });

            if (!authUser) {
                return { ok: false, error: 'User not found' };
            }

            const secret = mfaUtils.generateSecret(authUser.email);
            const qrCode = await mfaUtils.generateQRCode(secret.otpauth_url!);

            return {
                ok: true,
                secret: secret.base32,
                qrCode,
            };
        } catch (error) {
            console.error('Enable MFA error:', error);
            return { ok: false, error: 'Failed to enable MFA' };
        }
    },

    verifyMfaSetup: async (data: {
        userId: string;
        secret: string;
        code: string;
    }) => {
        try {
            const isValid = mfaUtils.verifyToken(data.code, data.secret);

            if (!isValid) {
                return { ok: false, error: 'Invalid verification code' };
            }

            const backupCodes = mfaUtils.generateBackupCodes();
            const hashedBackupCodes = await mfaUtils.hashBackupCodes(backupCodes);

            await db
                .update(authUsers)
                .set({
                    mfaEnabled: true,
                    mfaSecret: data.secret,
                    mfaBackupCodes: JSON.stringify(hashedBackupCodes),
                })
                .where(eq(authUsers.userId, data.userId));

            return {
                ok: true,
                backupCodes,
            };
        } catch (error) {
            console.error('Verify MFA setup error:', error);
            return { ok: false, error: 'Failed to verify MFA setup' };
        }
    },

    disableMfa: async (userId: string, code: string) => {
        try {
            const authUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.userId, userId),
            });

            if (!authUser || !authUser.mfaSecret) {
                return { ok: false, error: 'MFA not enabled' };
            }

            const isValid = mfaUtils.verifyToken(code, authUser.mfaSecret);

            if (!isValid) {
                return { ok: false, error: 'Invalid verification code' };
            }

            await db
                .update(authUsers)
                .set({
                    mfaEnabled: false,
                    mfaSecret: null,
                    mfaBackupCodes: null,
                })
                .where(eq(authUsers.userId, userId));

            return { ok: true };
        } catch (error) {
            console.error('Disable MFA error:', error);
            return { ok: false, error: 'Failed to disable MFA' };
        }
    },

    requestPasswordReset: async (email: string) => {
        try {
            const authUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.email, email),
            });

            if (!authUser) {
                return { ok: true };
            }

            const resetToken = generateId(40);
            const resetTokenExpiresAt = createDate(new TimeSpan(1, 'h'));

            await db
                .update(authUsers)
                .set({
                    resetPasswordToken: resetToken,
                    resetPasswordTokenExpiresAt: resetTokenExpiresAt,
                })
                .where(eq(authUsers.id, authUser.id));

            const resetLink = `${env.SITE_URL}/auth/reset-password?token=${resetToken}`;
            const html = await render(AuthenticationEmail(resetLink));

            await sendEmail({
                to: email,
                subject: 'Reset your password',
                html,
            });

            return { ok: true };
        } catch (error) {
            console.error('Password reset request error:', error);
            return { ok: false, error: 'Failed to send reset email' };
        }
    },

    resetPassword: async (data: { token: string; newPassword: string }) => {
        try {
            const authUser = await db.query.authUsers.findFirst({
                where: eq(authUsers.resetPasswordToken, data.token),
            });

            if (!authUser) {
                return { ok: false, error: 'Invalid or expired reset token' };
            }

            if (
                authUser.resetPasswordTokenExpiresAt &&
                new Date() > authUser.resetPasswordTokenExpiresAt
            ) {
                return { ok: false, error: 'Reset token has expired' };
            }

            const passwordValidation = passwordUtils.isStrong(data.newPassword);
            if (!passwordValidation.isValid) {
                return { ok: false, error: passwordValidation.message };
            }

            const passwordHash = await passwordUtils.hash(data.newPassword);

            await db
                .update(authUsers)
                .set({
                    passwordHash,
                    resetPasswordToken: null,
                    resetPasswordTokenExpiresAt: null,
                })
                .where(eq(authUsers.id, authUser.id));

            return { ok: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { ok: false, error: 'Failed to reset password' };
        }
    },
};