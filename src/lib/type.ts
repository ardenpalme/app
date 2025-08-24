import type { StoreType } from 'polotno/model/store'; 
import { CreativeList, CreativeObj, designList, designObj, rssObjList } from "@/schemas/assets"
import { ElementType } from 'polotno/model/group-model';

export interface LayoutEditorProps {
  creatives: CreativeList;
  rssObjs: rssObjList;
  designs: designList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (asset : CreativeObj) => Promise<void>;
  uploadRSS: (rssUrl : string) => Promise<void>;
  uploadDesign: (store : StoreType) => Promise<void>;
  deleteDesign: (design : designObj) => Promise<void>;
}

export interface AssetsPanelProps {
  store: StoreType;
  creatives: CreativeList;
  designs: designList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (asset : CreativeObj) => Promise<void>;
  deleteDesign: (design : designObj) => Promise<void>;
}

export interface ToolbarProps {
  store: StoreType;
  onRefresh : () => Promise<void>;
  uploadDesign: (store : StoreType) => Promise<void>;
}

export interface RSSPanelProps {
  store: StoreType;
  rssObjs: rssObjList;
  uploadRSS: (rssUrl : string) => Promise<void>;
}

