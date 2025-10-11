import React, { useState } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

const DocPreview = ({ docUrl, docType }: { docUrl: string, docType: string }) => {
    const docs = [
        { uri: docUrl, fileType: docType },
    ];
    const [activeDocument] = useState(docs[0]);
    return (
        <>
            <DocViewer
                documents={docs}
                activeDocument={activeDocument}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: { disableHeader: true },
                    pdfVerticalScrollByDefault:true,
                    pdfZoom: {
                        defaultZoom: .8, 
                        zoomJump: 0.2,
                      },
                }}
                style={{ width: 1000, height: 1000 * 1.41 }}
            />
        </>
    );
};

export default DocPreview;
