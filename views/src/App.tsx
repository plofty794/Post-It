import { RouterProvider } from "react-router-dom";
import Router from "./router/Router.tsx";

function App() {
  return <RouterProvider router={Router()} />;
}

export default App;
