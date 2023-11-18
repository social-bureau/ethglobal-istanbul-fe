import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./route/AppRoutes";
import { CombineComponents } from "./wrapper/CombineComponents";
import FlowbiteProvider from "./wrapper/FlowbiteProvider";
import ReduxProvider from "./wrapper/ReduxProvider";
import WagmiProvider from "./wrapper/WagmiProvider";
import AccountPortal from "./wrapper/AccountPortal";
import ToastifyPortal from "./wrapper/ToastifyPortal";
import { SkeletonTheme } from "react-loading-skeleton";

const providers = [
  ReduxProvider,
  ToastifyPortal,
  SkeletonTheme,
  FlowbiteProvider,
  WagmiProvider,
  AccountPortal,
  BrowserRouter,
];
const AppProvider = CombineComponents(...providers);

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
