import type { StoreType } from 'polotno/model/store'; 
import { CreativeList, CreativeObj, designList, designObj, playlistList, rssObj, rssObjList, rssObjRender, rssObjRenderList } from "@/schemas/assets"
import { z } from 'zod'
import { ElementType } from 'polotno/model/group-model';
import { FeedItem } from '@rowanmanning/feed-parser/lib/feed/item/base';
import { contentBase } from '@/schemas/content';

export interface LayoutEditorProps {
  creatives: CreativeList;
  rssObjs: rssObjList;
  designs: designList;
  onRefresh : () => Promise<void>;
  uploadAsset: (localFile : File) => Promise<void>;
  deleteAsset: (asset : CreativeObj) => Promise<void>;
  uploadRSS: (rssUrl : string) => Promise<void>;
  deleteRSS: (rssItem : rssObjRender) => Promise<void>;
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
  onRefresh : () => Promise<void>;
  uploadRSS: (rssUrl : string) => Promise<void>;
  deleteRSS: (rssItem : rssObjRender) => Promise<void>;
}

export type RSSImgObject = {
  content_width: number;
  content_height: number;
  rss_item: FeedItem;
}

export type RSSTickerObject = { items: [{
  title: string,
  url: string
}]}

export type PlaylistItem = {
  id: string,
  aspectRatio: string,
  asset: CreativeObj,
}

export interface ContentSelectorProps {
  orgId: string;
  creatives: CreativeList;
  designs: designList;
  playlists: playlistList;
  onChange: (content: contentBase) => void;
  currContent: contentBase | null;
}

export interface CalendarProps {
  creatives: CreativeList;
  designs: designList;
  playlists: playlistList;
  orgId: string;
}
