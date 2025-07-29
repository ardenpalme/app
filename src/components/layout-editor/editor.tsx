"use client"

import React from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';
import { UploadPanel } from './upload-panel';
import { LayoutEditorProps } from '@/lib/type';

const store = createStore({
  key: 'iBbDdFxct_0aplfGoI8Q', // you can create it here: https://polotno.com/cabinet/
  // you can hide back-link on a paid license
  // but it will be good if you can keep it for Polotno project support
  showCredit: true,
});

const page = store.addPage();

export default function LayoutEditor ({creatives, onRefresh, uploadAsset, deleteAsset} : LayoutEditorProps) {
  // find default upload section
  const UploadSection = DEFAULT_SECTIONS.find(
    (section) => section.name === 'upload'
  );

  // overwrite its panel component
  if (UploadSection) { // TODO if its not defined?
    UploadSection.Panel = () => {
      return (
        <UploadPanel 
          store={store}
          creatives={creatives}
          onRefresh={onRefresh}
          uploadAsset={uploadAsset}
          deleteAsset={deleteAsset}
          />
      );
    }
  }

  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@blueprintjs/core@5/lib/css/blueprint.css"
      />
      <SidePanelWrap>
        <SidePanel 
          store={store} 
          sections={DEFAULT_SECTIONS}
          defaultSection="upload"
          />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

