import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TEmailVerificationCode,
  TSignUpEmail,
  ZodEmailVerificationCodeSchema,
  ZodSignUpEmailSchema,
} from "@/validation/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/lib/custom/utils";
import { useNavigate } from "react-router-dom";
import useEmailVerificationCode from "@/hooks/no-auth/useEmailVerificationCode";
import useSignUp from "@/hooks/no-auth/useSignUp";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RotateCwIcon } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

function SignUp() {
  useDocumentTitle("Sign up - Post It");
  const navigate = useNavigate();
  const { mutate, isSuccess, isPending } = useEmailVerificationCode();
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TSignUpEmail>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ZodSignUpEmailSchema),
  });

  function verifyEmail(value: TSignUpEmail) {
    mutate({ email: value.email });
    reset();
  }

  return (
    <>
      <Button
        className={cn("absolute top-4 right-8", isPending && "animate-pulse")}
        variant={"ghost"}
        onClick={() => navigate("/login")}
      >
        Login
      </Button>

      {isSuccess && <EmailVerificationCodeCard />}
      {!isSuccess && (
        <>
          <div className="flex items-center justify-center gap-4">
            <Card className="rounded-xl overflow-hidden">
              <img
                src="/post it logo.jpg"
                className="size-14 hover:scale-110 transition-transform"
              />
            </Card>
            <h1 className="logo">Post It</h1>
          </div>
          <Card className="w-2/6 max-lg:w-2/4 max-md:w-3/4 max-sm:w-full">
            <CardHeader className="text-center flex flex-col gap-2">
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your email below to verify your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(verifyEmail)}>
                <div className="flex flex-col gap-2">
                  <Input
                    {...register("email")}
                    autoComplete="off"
                    className=""
                    autoFocus
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <ErrorMessage message={errors.email.message} />
                  )}
                  <Button
                    disabled={errors.email != null || isPending}
                    size={"sm"}
                    className="w-full  gap-2"
                  >
                    Sign up with Email
                    {isPending ? (
                      <RotateCwIcon className="size-5 animate-spin" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}

function EmailVerificationCodeCard() {
  const { mutate, isPending } = useSignUp();
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [isHidden2, setIsHidden2] = useState<boolean>(true);

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TEmailVerificationCode>({
    mode: "onChange",
    defaultValues: {
      verificationCode: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
    resolver: zodResolver(ZodEmailVerificationCodeSchema),
  });

  function verifyCode(values: TEmailVerificationCode) {
    mutate(values);
    reset();
  }

  return (
    <Card className="w-2/4 max-lg:w-2/4 max-md:w-3/4 max-sm:w-full fade-in">
      <CardHeader className="text-center flex flex-col gap-2">
        <CardTitle className="text-green-400">
          We want to make sure it's you
        </CardTitle>
        <CardDescription>
          Enter the 6-digit email verification code below to verify your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(verifyCode)}>
          <div className="flex flex-col gap-2">
            <div className=" w-72 mx-auto flex flex-col gap-2">
              <Input
                {...register("verificationCode")}
                autoComplete="off"
                className=""
                autoFocus
                placeholder="6-digit code"
              />
              {errors.verificationCode && (
                <ErrorMessage message={errors.verificationCode.message} />
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <CardDescription className="text-center">
                Enter your details to finish up
              </CardDescription>
              <div className="flex gap-4">
                <div className="w-full flex flex-col gap-2">
                  <Input
                    {...register("username")}
                    autoComplete="off"
                    className=""
                    placeholder="Username"
                  />
                  {errors.username && (
                    <ErrorMessage message={errors.username.message} />
                  )}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Input
                    {...register("email")}
                    autoComplete="off"
                    className=""
                    placeholder="Email"
                  />
                  {errors.email && (
                    <ErrorMessage message={errors.email.message} />
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-full flex flex-col gap-2">
                  <Input
                    {...register("firstName")}
                    autoComplete="off"
                    className=""
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <ErrorMessage message={errors.firstName.message} />
                  )}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Input
                    {...register("lastName")}
                    autoComplete="off"
                    className=""
                    placeholder="Surname"
                  />
                  {errors.lastName && (
                    <ErrorMessage message={errors.lastName.message} />
                  )}
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <Input
                  {...register("password")}
                  type={`${isHidden ? "password" : "text"}`}
                  autoComplete="off"
                  className=""
                  placeholder="Password"
                />
                {errors.password && (
                  <ErrorMessage message={errors.password.message} />
                )}
                <div className="absolute right-0 top-0 flex w-max justify-between">
                  <Toggle
                    onPressedChange={(v) => setIsHidden(v)}
                    className="ml-auto rounded-full !bg-transparent p-2"
                    tabIndex={-1}
                  >
                    {isHidden ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </Toggle>
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <Input
                  {...register("confirmPassword")}
                  type={`${isHidden2 ? "password" : "text"}`}
                  autoComplete="off"
                  className=""
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <ErrorMessage message={errors.confirmPassword.message} />
                )}
                <div className="absolute right-0 top-0 flex w-max justify-between">
                  <Toggle
                    onPressedChange={(v) => setIsHidden2(v)}
                    className="ml-auto rounded-full !bg-transparent p-2"
                    tabIndex={-1}
                  >
                    {isHidden2 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </Toggle>
                </div>
              </div>
            </div>
            <Button
              disabled={
                errors.verificationCode != null ||
                errors.username != null ||
                errors.firstName != null ||
                errors.lastName != null ||
                isPending
              }
              size={"sm"}
              className="w-full  gap-2"
            >
              Continue
              {isPending ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 animate-spin"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              ) : (
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
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SignUp;
