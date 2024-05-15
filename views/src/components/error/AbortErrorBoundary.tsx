import { useRouteError } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Lottie from "lottie-react";
import Slow from "../../assets/Slow.json";
import { Button } from "../ui/button";
import { RotateCwIcon } from "lucide-react";

function AbortErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <main className="dark:bg-[#09090B] dark:text-white min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader className="pt-0 flex flex-col gap-2 items-center justify-center">
          <Lottie className="w-56 h-max" animationData={Slow} loop={true} />
          <CardTitle>{error.message}</CardTitle>
          <CardDescription>
            Please check your connection and try again
          </CardDescription>
          <Button
            onClick={() => window.location.reload()}
            className="gap-2"
            variant={"secondary"}
          >
            <RotateCwIcon className="size-5" />
            Reload page
          </Button>
        </CardHeader>
      </Card>
    </main>
  );
}

export default AbortErrorBoundary;
