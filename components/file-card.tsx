"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DeleteIcon,
  File,
  FileTextIcon,
  ImageIcon,
  MoreVertical,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { deleteFile } from "@/app/actions/file-actions";
import Image from "next/image";
import { getFileUrl } from "@/utils/getFileUrl";

const fileTypes = {
  image: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/svg",
    "image/webp",
    "image/svg+xml",
  ],
  video: ["video/mp4", "video/mov", "video/avi"],
  audio: ["audio/mp3", "audio/wav", "audio/ogg"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

const DropdownActions = ({
  file,
}: {
  file: {
    id: string;
    title: string;
    type: string;
    file_name: string;
  };
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile(file.file_name);
                toast({
                  title: "File Deleted",
                  description: "Your file has been successfully deleted",
                  variant: "default",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1 text-red-500 items-center cursor-pointer"
            onClick={() => setIsConfirmOpen(true)}
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default function FileCard({ file }: { file: any }) {
  console.log("file", file);
  let fileType = fileTypes.document.includes(file.type)
    ? "document"
    : fileTypes.image.includes(file.type)
      ? "image"
      : fileTypes.video.includes(file.type)
        ? "video"
        : fileTypes.audio.includes(file.type)
          ? "audio"
          : "unknown";

  const fileUrl = getFileUrl(file.file_name);
  return (
    <Card className="justify-between flex flex-col">
      <CardHeader className="relative">
        <div className="flex items-center gap-1">
          {fileType === "image" ? (
            <ImageIcon />
          ) : fileType === "document" ? (
            <FileTextIcon />
          ) : (
            <File />
          )}
          <CardTitle className="flex items-end justify-between">
            {file.title}
          </CardTitle>
        </div>
        <div className="absolute top-1 right-1">
          <DropdownActions file={file} />
        </div>
      </CardHeader>
      <CardContent className="cursor-pointer">
        {fileType === "image" && (
          <Image
            src={fileUrl.publicUrl}
            alt={file.title}
            width={400}
            height={250}
            style={{ objectFit: "cover" }}
          />
        )}
        {fileType === "document" && (
          <div className="flex items-center gap-1 justify-center h-24">
            <FileTextIcon width={400} height={100} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
}
