import type { StoreType } from 'polotno/model/store'; 
import { CreativeList, rssObjList } from "@/schemas/assets"

export interface UploadPanelProps {
  store: StoreType;
  creatives: CreativeList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (fileId : string) => Promise<void>;
}

export interface LayoutEditorProps {
  creatives: CreativeList;
  rssObjs: rssObjList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (fileId : string) => Promise<void>;
  uploadRSS: (rssUrl : string) => Promise<void>;
}

export interface AssetsPanelProps {
  store: StoreType;
  creatives: CreativeList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (fileId : string) => Promise<void>;
}

export interface RSSPanelProps {
  store: StoreType;
  rssObjs: rssObjList;
  uploadRSS: (rssUrl : string) => Promise<void>;
}


