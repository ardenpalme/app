"use client"

import React, { useEffect } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { BackgroundSection, ElementsSection, Section, SectionTab, SidePanel, TemplatesSection, TextSection, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import { LayoutEditorProps } from '@/lib/type';
import { MediaPanel} from './media-panel';
import { BookText, LayoutTemplate, Rss, RssIcon } from 'lucide-react';
import { RSSPanel } from './rss-panel';
import { Button } from '@blueprintjs/core';

const store = createStore({
  key: 'iBbDdFxct_0aplfGoI8Q', // you can create it here: https://polotno.com/cabinet/
  // you can hide back-link on a paid license
  // but it will be good if you can keep it for Polotno project support
  showCredit: true,
});

const page = store.addPage();
page.set({
  height: 1920,
  width: 1080,
});

export default function LayoutEditor ({creatives, rssObjs, designs, onRefresh, uploadAsset, deleteAsset, uploadRSS, deleteRSS, uploadDesign, deleteDesign} : LayoutEditorProps) {
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
      <SectionTab {...props} name="Library">
        <div className='w-full h-full flex items-center justify-center'>
          <BookText className='w-5 h-5'/>
        </div>
      </SectionTab>
    ),
    // we need observer to update component automatically on any store changes
    Panel: (() => {
      return (
        <MediaPanel
          store={store}
          creatives={creatives}
          designs={designs}
          onRefresh={onRefresh}
          uploadAsset={uploadAsset}
          deleteAsset={deleteAsset}
          deleteDesign={deleteDesign}
          />
      );
    }),
  } as Section; 

  // define the new custom section
  const RSSSection = {
    name: 'rss',
    Tab: (props) => (
      <SectionTab {...props} name="RSS">
        <div className='w-full h-full flex items-center justify-center'>
          <RssIcon className='w-5 h-5'/>
        </div>
      </SectionTab>
    ),
    // we need observer to update component automatically on any store changes
    Panel: (() => {
      return (
        <RSSPanel
          store={store}
          onRefresh={onRefresh}
          rssObjs={rssObjs}
          uploadRSS={uploadRSS}
          deleteRSS={deleteRSS}
          />
      );
    }),
  } as Section; 

  const ActionControls = ({ store }) => {
    const [isSaving, setSaving] = React.useState(false);
    const handleSave = async() => {
      try {
        setSaving(true)
        await uploadDesign(store)
        await onRefresh();
      } finally {
        setSaving(false)
      }
    }
    return (
      <div>
        <Button
          intent="primary"
          onClick={handleSave}
          loading={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  };

  const sections: Section[] = [MediaSection, RSSSection, TextSection, ElementsSection];

  return (
    <PolotnoContainer>
      <SidePanelWrap>
        <SidePanel 
          store={store} 
          sections={sections}
          defaultSection="media"
          />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} components={{
          ActionControls,
        }}/>
        <Workspace store={store} />
        <ZoomButtons store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

