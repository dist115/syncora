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

interface InvitationEmailProps {
  url: string;
  logo: string;
  userName: string;
  team: string;
}

export default function InvitationEmail({
  url,
  logo,
  userName,
  team,
}: InvitationEmailProps) {
  return (
    <Html>
      <Head>
        <Font fontFamily="Inter" fallbackFontFamily="Arial" fontWeight={400} />
      </Head>
      <Preview>You are invited to join {team}</Preview>
      <Tailwind config={TailwindConfig}>
        <Body className="bg-white">
          <Container className="mx-auto w-[560px] px-8 pt-14 pb-12 mt-8 border border-solid rounded-lg bg-steel-50/30 border-steel-100">
            <Section className="text-center">
              {logo ? (
                <Img
                  src={logo}
                  width="120"
                  height="30"
                  alt="Syncora"
                  className="object-contain mx-auto my-0"
                />
              ) : (
                <Heading className="m-0 text-2xl font-medium">Syncora</Heading>
              )}
            </Section>

            <Section>
              <Heading className="my-8 text-xl font-medium text-center text-steel-700">
                Join {team} on Syncora
              </Heading>
              <Text className="text-sm text-steel-600">Hello {userName},</Text>
              <Text className="text-sm leading-loose text-steel-600">
                You are invited to join {team} on Syncora. To accept this
                invitation, please click the button below.
              </Text>
            </Section>

            <Section className="my-4 text-center">
              <Button
                href={url}
                className="text-sm rounded cursor-pointer bg-steel-700 text-steel-100 px-[26px] py-[12px]]"
              >
                Join now
              </Button>
            </Section>

            <Section>
              <Text className="mb-0 text-sm text-steel-700">
                If you were not expecting this invitation, you can ignore this
                email.
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
