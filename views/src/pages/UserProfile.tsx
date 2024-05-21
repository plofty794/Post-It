import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useGetUser from "@/hooks/auth/useGetUser";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { TEditProfile, ZodEditProfileSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/lib/custom/utils";
import AvatarDropzone from "@/components/AvatarDropZone";
import useEditProfile from "@/hooks/auth/useEditProfile";
import ProfileTabs from "@/components/ProfileTabs";

function UserProfile() {
  const matches = useMediaQuery("(min-width: 768px)");
  const { data, isPending } = useGetUser();

  return (
    <div className="pt-8 pb-16 px-12">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-6">
          {isPending ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="relative">
                <Avatar className="h-28 w-28 border">
                  <AvatarImage
                    src={
                      data?.data.profilePicUrl ??
                      "https://github.com/shadcn.png"
                    }
                    className="object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 right-0 z-10 ">
                  <Dialog>
                    <DialogTrigger className="w-max" asChild>
                      <Button
                        className="rounded-full p-2"
                        variant={"outline"}
                        size={"icon"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          />
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Choose profile picture
                        </DialogTitle>
                      </DialogHeader>
                      <Separator />
                      <AvatarDropzone />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-2xl font-bold">{data?.data.username}</p>
                <CardDescription className="text-xs font-medium">
                  {data?.data.email}
                </CardDescription>
              </div>
            </>
          )}
        </div>
        {matches ? <EditProfileDialog /> : <EditProfileDrawer />}
      </div>
      <Separator className="mt-8" />
      <div className="pt-8 pb-16 w-full">
        <ProfileTabs />
      </div>
    </div>
  );
}

function EditProfileDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs" variant={"secondary"} size={"sm"}>
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg dark:text-white">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function EditProfileDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="text-xs" variant={"secondary"} size={"sm"}>
          Edit profile
        </Button>
      </DrawerTrigger>
      <DrawerContent className="dark:text-white">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <ProfileForm className="px-4" setOpen={setOpen} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  setOpen,
}: {
  className?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutate, isPending, isSuccess } = useEditProfile();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TEditProfile>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
    },
    mode: "onChange",
    resolver: zodResolver(ZodEditProfileSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess, setOpen]);

  function editProfile(values: TEditProfile) {
    mutate(values);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(editProfile)}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          {...register("username")}
          autoComplete="off"
          autoFocus
          id="username"
        />
        {errors.username && <ErrorMessage message={errors.username.message} />}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="firstName">First name</Label>
        <Input {...register("firstName")} autoComplete="off" id="firstName" />
        {errors.firstName && (
          <ErrorMessage message={errors.firstName.message} />
        )}
        <Label htmlFor="lastName">Last name</Label>
        <Input {...register("lastName")} autoComplete="off" id="lastName" />
        {errors.lastName && <ErrorMessage message={errors.lastName.message} />}
      </div>
      <div className="flex justify-between w-full">
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
        <Button
          className="gap-2"
          disabled={
            errors.username != null ||
            errors.firstName != null ||
            errors.lastName != null ||
            isPending
          }
          variant={"outline"}
        >
          {isPending ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Save changes
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}

function SkeletonLoader() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-28 w-28 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default UserProfile;
