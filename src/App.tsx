import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Buffer } from "buffer";

import "react-toastify/dist/ReactToastify.css";

import Routers from "./components/Router";
import MetmaskContextProvider from "./contexts/MetmaskContextProvider";

function App() {
  if (!(window as any).Buffer) (window as any).Buffer = Buffer;
  return (
    <MetmaskContextProvider>
      <div className="relative w-full overflow-x-hidden min-h-screen" id="dashboard">
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </div>
      <ToastContainer />
    </MetmaskContextProvider>
  );
}

export default App;
