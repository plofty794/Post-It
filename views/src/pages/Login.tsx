import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useLogin from "@/hooks/no-auth/useLogin";
import { useForm } from "react-hook-form";
import { TLogin, ZodLoginSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/lib/custom/utils";
import { cn } from "@/lib/utils";
import { RotateCwIcon } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

function Login() {
  useDocumentTitle("Login - Post It");
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TLogin>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(ZodLoginSchema),
  });

  function login(values: TLogin) {
    mutate({ email: values.email, password: values.password });
    reset();
  }

  return (
    <>
      <Button
        disabled={isPending}
        className={cn("absolute top-4 right-8", isPending && "animate-pulse")}
        variant={"ghost"}
        onClick={() => navigate("/sign-up")}
      >
        Don't have an account?
      </Button>
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
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>
            Enter your email and password below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(login)}>
            <div className="flex flex-col gap-2">
              <Input
                {...register("email")}
                autoComplete="off"
                autoFocus
                placeholder="Email"
              />
              {errors.email && <ErrorMessage message={errors.email.message} />}
              <Input
                {...register("password")}
                type="password"
                autoComplete="off"
                placeholder="Password"
              />
              {errors.password && (
                <ErrorMessage message={errors.password.message} />
              )}
              <Button
                disabled={
                  errors.email != null || errors.password != null || isPending
                }
                size={"sm"}
                className="w-full  gap-2"
              >
                Sign in
                {isPending ? (
                  <RotateCwIcon className="size-5 animate-spin" />
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
    </>
  );
}

export default Login;
