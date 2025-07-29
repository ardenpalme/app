"use client"

import React, { useEffect } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { BackgroundSection, ElementsSection, Section, SectionTab, SidePanel, TemplatesSection, TextSection } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { LayoutEditorProps } from '@/lib/type';
import { MediaSection, PhotosPanel } from './assets-panel';
import { BookText } from 'lucide-react';

const store = createStore({
  key: 'iBbDdFxct_0aplfGoI8Q', // you can create it here: https://polotno.com/cabinet/
  // you can hide back-link on a paid license
  // but it will be good if you can keep it for Polotno project support
  showCredit: true,
});

const page = store.addPage();

export default function LayoutEditor ({creatives, onRefresh, uploadAsset, deleteAsset} : LayoutEditorProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = store.selectedElements;
        if (selected.length) {
          store.deleteElements(selected.map((elem) => elem.id));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

// define the new custom section
const MediaSection = {
  name: 'media',
  Tab: (props) => (
    <SectionTab {...props} name="Media">
      <div className='w-full h-full flex items-center justify-center'>
        <BookText className='w-5 h-5'/>
      </div>
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: (() => {
    return (
      <PhotosPanel
        store={store}
        creatives={creatives}
        onRefresh={onRefresh}
        uploadAsset={uploadAsset}
        deleteAsset={deleteAsset}
        />
    );
  }),
} as Section; 

  const sections: Section[] = [TemplatesSection, MediaSection, TextSection, ElementsSection, BackgroundSection];

  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@blueprintjs/core@5/lib/css/blueprint.css"
      />
      <SidePanelWrap>
        <SidePanel 
          store={store} 
          sections={sections}
          defaultSection="media"
          />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

