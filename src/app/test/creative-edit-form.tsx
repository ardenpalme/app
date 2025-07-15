"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { CreativeEditSchema, type CreativeObj } from "@/schemas/assets"
import { CreativeStatusBadge } from "@/components/status-badges"
import { formatBytes, formatDuration, gcd, formatDisplayDate } from "@/lib/utils"

type CreativeEditFormValues = z.infer<typeof CreativeEditSchema>

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-base">{value}</p>
  </div>
)

export function CreativeEditForm({
  creative,
  onSuccess,
}: {
  creative: CreativeObj
  onSuccess: () => void
}) {
  const form = useForm<CreativeEditFormValues>({
    resolver: zodResolver(CreativeEditSchema),
    defaultValues: {
      name: creative.name,
      notes: creative.notes || "",
      tags: creative.tags ?? [],
    },
  })

  const { mutateAsync : updateCreative, isPending : isUpdatingCreative} = trpc.creative.update.useMutation();

  const onSubmit = async(data: CreativeEditFormValues) => {
    try {
      const res = await updateCreative(data);
      console.log(res)
      toast.success("Creative has been resubmitted for review.")
      onSuccess();
    } catch(err) {
      if(err instanceof Error) {
        toast.error("Failed to resubmit creative", { description: err.message });
      }else{
        toast.error("Unknown Error")
      }
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={creative.fileUrl || "/placeholder.svg"}
            alt={creative.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {creative.width && creative.height ? (
            <>
              <DetailItem label="Resolution" value={`${creative.width} x ${creative.height}`} />
              <DetailItem
                label="Aspect Ratio"
                value={`${creative.width / gcd(creative.width, creative.height)}:${
                  creative.height / gcd(creative.width, creative.height)
                }`}
              />
            </>
          ) : null}
          {creative.duration ? <DetailItem label="Duration" value={formatDuration(creative.duration)} /> : null}
          <DetailItem label="File Size" value={formatBytes(creative.fileSize)} />
        </div>
        <DetailItem label="Campaign" value={creative.campaign?.name || "Unassigned"} />
        <DetailItem label="Status" value={<CreativeStatusBadge status={creative.approvalStatus} />} />
        <DetailItem
          label="Submitted"
          value={`${creative.submittedBy || "-"} on ${
            creative.submissionDate ? formatDisplayDate(creative.submissionDate, "PPP") : "-"
          }`}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creative Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} value={field.value ?? ""}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                 <Input
                    value={field.value?.join(", ") ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value
                          .split(",")
                          .map(tag => tag.trim())
                          .filter(Boolean)
                      );
                    }}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">Enter tags separated by commas.</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdatingCreative}>
              {isUpdatingCreative && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

