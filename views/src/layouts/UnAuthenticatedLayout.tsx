import { Outlet } from "react-router-dom";

function UnAuthenticatedLayout() {
  return (
    <main className="dark:bg-[#09090B] dark:text-white">
      <div className="2xl:container relative flex flex-col gap-4 items-center justify-center min-h-screen">
        <Outlet />
      </div>
    </main>
  );
}

export default UnAuthenticatedLayout;
