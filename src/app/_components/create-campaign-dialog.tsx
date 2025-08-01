"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser, useOrganization } from "@clerk/nextjs"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { newCampaignFormSchema, NewCampaignFormSchema } from "@/schemas/assets"
import { DatePicker } from "@/components/ui/date-picker"


export function CreateCampaignDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {

  const { mutateAsync: addCampaign, isPending: isAddCampaignPending } = trpc.campaign.add.useMutation()

  const { user } = useUser()
  const organization = "test" //user ? `${user?.organizationMemberships[0]}` : "";

  const form = useForm<NewCampaignFormSchema>({
    resolver: zodResolver(newCampaignFormSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      notes: "",
      userId: user?.id,
      orgId: organization,
      submittedBy: user?.id,
      submissionDate: new Date()
    },
  })


  const createCampaign = async (data : NewCampaignFormSchema) => {
    try {
      console.log(data)
      await addCampaign(data);
      form.reset()
      onSuccess()

    } catch(err) {
      if(err instanceof Error) {
        toast.error("Failed to create campaign", {
          description: err.message,
        })
      }else{
        toast.error("Unkown Error")
      }
    }
  }

  function onSubmit(data: NewCampaignFormSchema) {
    if(data.endDate < data.startDate) {
      toast.error("Invalid Date Range")
    }else {
      createCampaign(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>Fill out the details below to create a new campaign.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddCampaignPending}>
                {isAddCampaignPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

