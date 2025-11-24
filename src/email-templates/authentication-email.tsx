import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';

import { TailwindConfig } from './config';

export default function AuthenticationEmail(url: string) {
  return (
    <Html>
      <Head>
        <Font fontFamily="Inter" fallbackFontFamily="Arial" fontWeight={400} />
      </Head>
      <Preview>Sign in with this magic link </Preview>
      <Tailwind config={TailwindConfig}>
        <Body className="bg-white">
          <Container className="mx-auto w-[560px] px-8 pt-14 pb-12 mt-8 border border-solid rounded-lg bg-steel-50/30 border-steel-100">
            <Section className="text-center">
              <Heading className="m-0 text-2xl font-medium">Syncora</Heading>
            </Section>

            <Section>
              <Heading className="my-8 text-xl font-medium text-center text-steel-700">
                Welcome Onboard!
              </Heading>
              <Text className="text-sm text-steel-600">Hello there,</Text>
              <Text className="text-sm leading-loose text-steel-600">
                We are excited to have you on board. Syncora keeps your files safe, private, and always within reach.
                To complete your email verification process and access your secure cloud storage dashboard, please click the button below:
              </Text>
            </Section>

            <Section className="my-4 text-center">
              <Button
                href={url}
                className="text-sm py-4 px-6 rounded cursor-pointer bg-steel-700 text-steel-100"
              >
                Sign In
              </Button>
            </Section>

            <Section>
              <Text className="mb-0 text-sm text-steel-700">
                If you did not request this, please ignore this email.
              </Text>
            </Section>
          </Container>

          <Container className="text-center">
            <Text className="text-sm text-steel-400">
              © {format(new Date(), 'yyyy')} Syncora, All Rights Reserved
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}