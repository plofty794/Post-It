import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import useUploadAvatar from "@/hooks/auth/services/useUploadAvatar";

const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const api_key = import.meta.env.VITE_CLOUDINARY_API_KEY;

export interface TProfilePic extends File {
  preview?: string;
}

function AvatarDropzone() {
  const { mutate, isPending } = useUploadAvatar();
  const [profilePic, setProfilePic] = useState<TProfilePic | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: TProfilePic[]) => {
      if (acceptedFiles.length > 0) {
        if (acceptedFiles[0].name === profilePic?.name) {
          return toast.info("Same image has already been selected.");
        }
        const preview = URL.createObjectURL(acceptedFiles[0]);
        const file = Object.assign(acceptedFiles[0], { preview });
        setProfilePic(file);
      }
    },
    [profilePic?.name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 4194304,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    onDropRejected(rejectedFiles) {
      if (rejectedFiles[0].errors[0].code === "file-too-large") {
        toast.warning("File is too large.", {
          description: "maximum files size is 4mb",
        });
      } else if (rejectedFiles[0].errors[0].code === "file-invalid-type") {
        toast.warning("Invalid file type", {
          description: "upload a file with .jpeg or .png extension",
        });
      }
    },
  });

  function uploadAvatar(file: File) {
    if (file == null) return;
    mutate({ file, api_key, upload_preset });
  }

  return (
    <>
      <div
        {...getRootProps({
          className: `${
            isDragActive ? "bg-[#292524]" : ""
          } hover:bg-[#292524] transition-colors cursor-pointer p-10 rounded-md flex flex-col gap-1 items-center`,
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke={isDragActive ? "#FF385C" : "currentColor"}
          className={cn("size-7", isDragActive ? "animate-bounce" : "")}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
          />
        </svg>

        <input {...getInputProps()} />

        {isDragActive ? (
          <p className="text-xs text-stone-400">Drop the files here ...</p>
        ) : (
          <p className="text-xs text-stone-400">
            Click to upload or drag and drop
          </p>
        )}
      </div>

      {profilePic && (
        <>
          <div className="fade-in flex flex-col items-center gap-2 mb-4">
            <Badge className="w-max" variant={"secondary"}>
              Image preview
            </Badge>
            <Avatar
              className={cn(
                "h-28 w-28 border",
                isPending ? "animate-pulse opacity-80" : ""
              )}
            >
              <AvatarImage src={profilePic?.preview} className="object-cover" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <CardFooter className="flex flex-col justify-center pb-0 px-0 gap-2">
            <Button
              disabled={isPending}
              onClick={() => uploadAvatar(profilePic)}
              className="w-full"
            >
              Make Avatar
            </Button>
            <Button
              className="w-full"
              onClick={() => setProfilePic(null)}
              variant={"ghost"}
            >
              Cancel
            </Button>
          </CardFooter>
        </>
      )}
    </>
  );
}

export default AvatarDropzone;
