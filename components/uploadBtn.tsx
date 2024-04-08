"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

export const UploadBtn = () => {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  let orgId = null;
  const createFile = useMutation(api.files.createFile);
  const organization = useOrganization();
  const user = useUser();
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { toast } = useToast();

  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(100, {
        message: "Username must be at most 100 characters.",
      }),
    file: z
      .custom<FileList>((val) => val instanceof FileList, "Required")
      .refine((files) => files.length > 0, `Required`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0]!.type },
      body: values.file[0],
    });

    const { storageId } = await result.json();
    if (!orgId) return;
    try {
      await createFile({ name: values.title, orgId, fileId: storageId });
      form.reset();
      setIsFileDialogOpen(false);
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Select a file to be uploaded</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="my awesome file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Your File</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex gap-1"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
