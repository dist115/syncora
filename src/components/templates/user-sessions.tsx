import { userAgentFromString } from 'next/server';
import { Text, Title } from 'rizzui';

import { Card } from '@/components/atoms/card';
import { Box } from '@/components/atoms/layout';
import { PageHeader } from '@/components/atoms/page-header';

export const UserSessions = ({
  session,
  sessionToken,
}: {
  session: any;
  sessionToken: string;
}) => {
  const sessions = session.map((data: any) => {
    const { browser, os } = userAgentFromString(data.userAgent);

    return {
      ...data,
      browser: browser,
      os: os,
    };
  });

  return (
    <>
      <Box>
        <PageHeader
          title="Devices and Browser Sessions"
          description="Manage and logout your active sessions on other browsers and
            devices."
          titleClassName="text-lg xl:text-xl"
          childrenClassName="flex [@media(min-width:500px)]:inline-flex"
          className="items-center"
          headingWrapperClassName="[@media(min-width:500px)]:w-auto"
        />
        {sessions.map((session: any) => {
          return (
            <Card key={session.id} className="w-full my-8">
              {sessionToken === session.sessionToken ? (
                <Title className="mb-2">This Device</Title>
              ) : null}
              <Text>{session.userIp}</Text>
              <Text>{session.browser.name}</Text>
              <Text>{session.os.name}</Text>
            </Card>
          );
        })}
      </Box>
    </>
  );
};
