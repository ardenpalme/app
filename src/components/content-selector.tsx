import React, {useEffect, useState } from 'react';
import { ContentSelectorProps } from '@/lib/type';
import { CreativeList, designList, playlistList } from "@/schemas/assets"
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import Image from 'next/image';
import { createId } from '@paralleldrive/cuid2';
import { contentBase } from '@/schemas/content';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const ContentSelector = ({orgId, creatives, designs, playlists, currContent, onChange} : ContentSelectorProps) => {

  const handleContentChange = (id: string, type: "CREATIVE" | "DESIGN" | "PLAYLIST") => {
    const contentPayload : contentBase= {
      id: createId(),
      type: type,
      objId: id,
      scheduleIds: [""],
      orgId: orgId
    }
    onChange(contentPayload)
  }

  const getSelection = (content : contentBase | null) => {
    if(content == null) {
      return (
        <p>No content selected</p>
      )
    }
    if(content.type == "CREATIVE") {
      const asset = creatives.find(creative => creative.id == content.objId);
      if (asset?.fileType.startsWith("video")) {
        const url = asset?.fileUrl
        const thumbnailUrl = url.replace(/(\.[^/.]+)$/, '_thumbnail.jpg');
        console.log(thumbnailUrl)
        return (
          <div className='flex flex-row gap-2'>
            <Image
            src={`/api/r2/${thumbnailUrl}`}
            alt={`asset ${asset?.name}`}
            width={50}
            height={50}
            />
            {asset?.name}
          </div>
        );
      }else{
        return (
          <div className='flex flex-row gap-2'>
            <Image
            src={`/api/r2/${asset?.fileUrl}`}
            alt={`asset ${asset?.name}`}
            width={50}
            height={50}
            />
            {asset?.name}
          </div>
        );
      }
    } else if(content.type == "DESIGN") {
      const template = designs.find(design => design.id == content.objId);
      return (
        <div className='flex flex-row gap-2'>
          <Image
            src={`/api/r2/${template?.name}`}
            alt={`design ${template?.name}`}
            width={50}
            height={50}
          />
          {template?.name}
        </div>
      );

    }   
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        <div className="flex flex-row w-full items-center space-x-2 pl-2">
          <Button type="button" variant="outline">
          {/*{getSelection(currContent)}*/}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex mx-auto items-center justify-center">
        <Tabs defaultValue="media">
          <TabsList>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
          </TabsList>
          <TabsContent value='designs'>
            {designs.length > 0 && (designs.map((design) => (
              <Image
                src={`/api/r2/${design.name}`}
                alt={`design ${design.name}`}
                onClick={() => {handleContentChange(design.id, "DESIGN")}}
                width={50}
                height={50}
              />
            )))}
          </TabsContent>
          <TabsContent value="media">
            <div>
            {creatives.length > 0 && (creatives.map((creative) => {
              if (creative.fileType.startsWith("video")) {
                const url = creative.fileUrl
                const thumbnailUrl = url.replace(/(\.[^/.]+)$/, '_thumbnail.jpg');
                console.log(thumbnailUrl)
                return (
                  <Image
                  src={`/api/r2/${thumbnailUrl}`}
                  alt={`creative ${creative.name}`}
                  onClick={() => {handleContentChange(creative.id, "CREATIVE")}}
                  width={50}
                  height={50}
                  />
                );
              }else{
                return (
                  <Image
                  src={`/api/r2/${creative.fileUrl}`}
                  alt={`creative ${creative.name}`}
                  onClick={() => {handleContentChange(creative.id, "CREATIVE")}}
                  width={50}
                  height={50}
                  />
                );
              }
            }))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>

  );
}

