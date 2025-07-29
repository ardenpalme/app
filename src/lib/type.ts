import type { StoreType } from 'polotno/model/store'; 
import { CreativeList } from "@/schemas/assets"

export interface UploadPanelProps {
  store: StoreType;
  creatives: CreativeList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (fileId : string) => Promise<void>;
}

export interface LayoutEditorProps {
  creatives: CreativeList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (fileId : string) => Promise<void>;
}

export interface AssetsPanelProps {
  store: StoreType;
  creatives: CreativeList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (fileId : string) => Promise<void>;
}

