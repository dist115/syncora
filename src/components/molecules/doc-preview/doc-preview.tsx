'use client';

import React, { useEffect, useState } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { Box, Flex } from '@/components/atoms/layout';
import { SecureDocument } from '@/components/atoms/secure-media';
import { Text } from 'rizzui';

import { docHeader } from './doc-header';

/**
 * DocPreview Component
 * ✅ FIXED: Now fetches encrypted documents with credentials first
 */
const DocPreview = ({
  docUrl,
  docType,
}: {
  docUrl: string;
  docType: string;
}) => {
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  return (
    <SecureDocument src={docUrl}>
      {({ fileUrl, loading, error }) => {
        // Show loading state
        if (loading) {
          return (
            <Flex justify="center" align="center" className="w-full h-full">
              <Text
                as="span"
                className="rounded-full h-12 w-12 border border-t-0 border-r-0 border-[#0F172A] dark:border-white animate-spin"
              />
            </Flex>
          );
        }

        // Show error state
        if (error || !fileUrl) {
          return (
            <Flex
              justify="center"
              align="center"
              className="w-full h-full bg-steel-100 dark:bg-steel-700"
            >
              <Text className="text-steel-500 dark:text-steel-400">
                Failed to load document
              </Text>
            </Flex>
          );
        }

        // ✅ Render document with secure blob URL
        const docs = [{ uri: fileUrl, fileType: docType }];

        return (
          <DocViewer
            documents={docs}
            activeDocument={docs[0]}
            pluginRenderers={DocViewerRenderers}
            config={{
              header: { overrideComponent: docHeader },
              pdfVerticalScrollByDefault: true,
              pdfZoom: {
                defaultZoom: 0.8,
                zoomJump: 0.2,
              },
            }}
            style={{ width: '100%', height: screenHeight - 56 }}
            theme={{ disableThemeScrollbar: true }}
          />
        );
      }}
    </SecureDocument>
  );
};

export default React.memo(DocPreview);