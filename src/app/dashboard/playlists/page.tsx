"use client"

import { PlaylistEditor } from "@/app/_components/playlist-editor";
import { trpc } from "@/app/_trpc/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { editPlaylistFormSchema, playlistObj } from "@/schemas/assets";
import { Play } from "next/font/google";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import { Separator } from "@radix-ui/react-select";


export default function Playlists() {

  const { data: allAssets, isLoading: isLoadingAssets} = trpc.creative.listAll.useQuery()
  const {data : playlists, isLoading: playlistsLoading, refetch: refetchPlaylists} = trpc.playlist.listAll.useQuery();
  const { mutateAsync: deletePlaylist, isPending : isDeletingPlaylist} = trpc.playlist.delete.useMutation()
  const { mutateAsync : upsertPlaylist, isPending : isUpsertingPlaylist} = trpc.playlist.upsert.useMutation();

  const { mutateAsync: addPlaylist } = trpc.playlist.add.useMutation()
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<playlistObj|null>();
  const [newPlaylistDialogOpen, setNewPlaylistDialogOpen] = React.useState<boolean>(false);
  const [playlistDurationSec, setPlaylistDurationSec] = React.useState<number>(0);
  const [assetIDOrder, setAssetIdOrder] = React.useState<string[]>([])

  const deleteSelectedPlaylist = async (playlist : playlistObj) => {
    await deletePlaylist({id: playlist.id})
  }

  const { isLoaded : isUserLoaded, user } = useUser();
  const orgs = user?.organizationMemberships

  console.log(user, orgs);

  const form = useForm<z.infer<typeof editPlaylistFormSchema>>({
    resolver: zodResolver(editPlaylistFormSchema),
    defaultValues: {
      name: "",
      assets: []
    },
  })

  async function onSubmit(values: z.infer<typeof editPlaylistFormSchema>) {
    const id= selectedPlaylist?.id ?? createId();
    const orgId = orgs?.[0].id
    const playlistData = {
      id: id,
      name: values.name,
      durationSec: playlistDurationSec,
      assets: values.assets,
      assetOrder: assetIDOrder,
      orgId: orgId ?? ""
    }

    console.log(playlistData)
    await upsertPlaylist(playlistData)
    await refetchPlaylists();
    setNewPlaylistDialogOpen(false)
    setSelectedPlaylist(null)
  }

  useEffect(() => {
    form.reset({
      name: selectedPlaylist?.name ?? '',
      assets: selectedPlaylist?.assets ?? [],
    })
  }, [selectedPlaylist, form])

  if(!playlists || !isUserLoaded) return null;

  return (
    <div>
      <Card className="mx-6">
        <div className="flex flex-row items-end justify-between px-3">
          Playlists
          <Button onClick={() =>{setNewPlaylistDialogOpen(true)}}>
            <Plus/> New Playlist
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Playlist Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Total Assets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlists.map((playlist) => (
            <ContextMenu key={playlist.id}>
              <ContextMenuTrigger asChild>
                <TableRow key={playlist.id}>
                  <TableCell>
                    {playlist.assets.length > 0 ? (
                      <div className="aspect-video w-20 overflow-hidden rounded-md bg-muted">
                        <img
                          src={`/api/r2/${playlist.assets[0].fileUrl}`}
                          alt={playlist.assets[0].name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      ) : (
                        <div className="aspect-video w-20 overflow-hidden rounded-md bg-muted">
                          <img
                            src="/placeholder.svg"
                            alt="placeholder image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )
                    }
                  </TableCell>
                  <TableCell className="font-medium">{playlist.name}</TableCell>
                  <TableCell className="text-muted-foreground">{playlist.durationSec}</TableCell>
                  <TableCell className="text-muted-foreground">{playlist.assets.length}</TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setSelectedPlaylist(playlist)}>Edit</ContextMenuItem>
                <ContextMenuItem onClick={() => {deleteSelectedPlaylist(playlist); refetchPlaylists()}}>Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Playlist Editor */}
      <Form {...form}>
        { (!!selectedPlaylist || newPlaylistDialogOpen) && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 mx-auto">
            <Card className="max-w-260 h-[75vh] rounded-2xl shadow-xl bg-background overflow">
              <CardContent className="px-6 h-full overflow-hidden">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
                  <CardHeader className="flex items-center justify-between border-b px-6 py-4">
                    <CardTitle>Edit Playlist</CardTitle>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedPlaylist(null);
                          setNewPlaylistDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </CardHeader>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row">
                          <FormLabel className="text-sm mr-2 ">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ad Loop" className="max-w-64" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assets</FormLabel>
                        <FormControl>
                          {/* give the editor room */}
                          <div className="h-[60vh] min-h-[400px]">
                            <PlaylistEditor
                              form_fields={field}
                              assets={allAssets ?? []}
                              assetOrder={!!selectedPlaylist ? selectedPlaylist.assetOrder : []}
                              setAssetIdOrder={setAssetIdOrder}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </Form>
    </div>
  );
}
