import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./route/AppRoutes";
import { CombineComponents } from "./wrapper/CombineComponents";
import FlowbiteProvider from "./wrapper/FlowbiteProvider";
import ReduxProvider from "./wrapper/ReduxProvider";
import WagmiProvider from "./wrapper/WagmiProvider";
import AccountPortal from "./wrapper/AccountPortal";
import ToastifyPortal from "./wrapper/ToastifyPortal";
import ContractPortal from "./wrapper/ContractPortal";
import SkeletonTheme from "./wrapper/SkeletonTheme";
import FirebasePortal from "./wrapper/FirebasePortal";
import ErrorBoundary from "./wrapper/ErrorBoundary";

const providers = [
  ReduxProvider,
  ErrorBoundary,
  ToastifyPortal,
  SkeletonTheme,
  // LightBoxPortal,
  FlowbiteProvider,
  WagmiProvider,
  ContractPortal,
  AccountPortal,
  FirebasePortal,
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
