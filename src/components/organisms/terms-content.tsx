'use client';

import { useEffect, useState } from 'react';

import { strHtmlHasTextContent } from '@/lib/utils/str-html-has-text-content';
import { StaticPageFallbackIllustration } from '@/components/atoms/illustrations/fallbacks/static-page-fallback-illustration';
import { Box, Flex } from '@/components/atoms/layout';
import { TextEditor } from '@/components/atoms/text-editor';
import { Fallback } from '@/components/molecules/Fallback';

export function TermsContent({ terms }: { terms: string }) {
  const [mounted, setMounted] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasContent(strHtmlHasTextContent(terms));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return (
      <Box className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl border border-[#262626]/10 shadow-xl bg-white shadow-[#262626]/[.06] space-y-20">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <Loader
            key={`terms-skeleton-${index}`}
          />
        ))}
      </Box>
    );
  }

  if (!hasContent) {
    return (
      <Box className="lg:[&_.tiptap_h3]:!text-lg [&_.tiptap_h3]:!text-base lg:[&_.tiptap_h3]:mb-4 [&_.tiptap_h3]:mb-2.5 lg:[&_.tiptap_p]:text-base [&_.tiptap_p]:text-sm lg:[&_.tiptap_p]:!leading-7 [&_.tiptap_p]:!leading-6 [&_.tiptap_p]:my-0 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl border border-[#262626]/10 shadow-xl bg-white shadow-[#262626]/[.06] space-y-20">
        <Flex justify="center" className="py-6 sm:py-12 xl:py-20">
          <Fallback
            illustration={StaticPageFallbackIllustration}
            illustrationClassName="w-[250px] sm:w-[400px] lg:w-[500px] xl:w-[610px] 3xl:w-[720px] h-auto"
            title="Sorry no result found!"
            titleClassName="text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl"
            subtitle="We couldn’t find anything"
            subtitleClassName="lg:text-base 3xl:text-xl 3xl:mt-3"
          />
        </Flex>
      </Box>
    );
  }

  return (
    <Box className="lg:[&_.tiptap_h3]:!text-lg [&_.tiptap_h3]:!text-base lg:[&_.tiptap_h3]:mb-4 [&_.tiptap_h3]:mb-2.5 lg:[&_.tiptap_p]:text-base [&_.tiptap_p]:text-sm lg:[&_.tiptap_p]:!leading-7 [&_.tiptap_p]:!leading-6 [&_.tiptap_p]:my-0 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl border border-[#262626]/10 shadow-xl bg-white shadow-[#262626]/[.06] space-y-20">
      <TextEditor editable={false} defaultValue={terms} />
    </Box>
  );
}

function Loader() {
  return (
    <Box className="w-full aspect-[1152/140] animate-pulse space-y-3">
      <Box className="rounded-md h-4 w-1/5 bg-[#dbdbdb]" />
      <Box className="rounded-md h-4 bg-[#dbdbdb]" />
      <Box className="rounded-md h-4 bg-[#dbdbdb]" />
      <Box className="rounded-md h-4 w-[90%] bg-[#dbdbdb]" />
      <Box className="rounded-md h-4 w-1/2 bg-[#dbdbdb]" />
    </Box>
  );
}
