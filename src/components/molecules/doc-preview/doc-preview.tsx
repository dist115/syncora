'use client';

import React, { useEffect, useState } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import { Box } from '@/components/atoms/layout';

import { docHeader } from './doc-header';

const DocPreview = ({
  docUrl,
  docType,
}: {
  docUrl: string;
  docType: string;
}) => {
  const docs = [{ uri: docUrl, fileType: docType }];
  const [screenHeight, setScreenHeight] = useState(0);
  const [activeDocument] = useState(docs[0]);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  return (
    <DocViewer
      documents={docs}
      activeDocument={activeDocument}
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
};

export default React.memo(DocPreview);
