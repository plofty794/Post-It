import { TProfilePic } from "@/components/AvatarDropZone";
import { useMutation } from "@tanstack/react-query";
import useChangeAvatar from "../users/useChangeAvatar";
import { toast } from "sonner";

type TUploadAvatar = {
  file: TProfilePic;
  upload_preset: string;
  api_key: string;
};

const config = {
  "X-Requested-With": "XMLHttpRequest",
};

function useUploadAvatar() {
  const { mutate } = useChangeAvatar();

  return useMutation({
    mutationFn: async ({ file, upload_preset, api_key }: TUploadAvatar) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", upload_preset);
      formData.append("api_key", api_key);
      return await fetch(
        `${import.meta.env.VITE_CLOUDINARY_URL}/dpqzpnxij/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: config,
        }
      );
    },
    onSuccess: async (data) => {
      const res = (await data.json()) as TCloudinaryResponse;
      mutate(res.secure_url);
    },
    onError(err) {
      toast.error(err.message);
    },
  });
}

type TCloudinaryResponse = {
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
};

export default useUploadAvatar;
