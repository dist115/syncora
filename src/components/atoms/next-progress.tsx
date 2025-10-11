'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function NextProgress() {
  return (
    <ProgressBar
      color="#40C17B"
      height="3px"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
