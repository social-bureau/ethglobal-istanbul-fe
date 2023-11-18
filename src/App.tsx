import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./route/AppRoutes";
import { CombineComponents } from "./wrapper/CombineComponents";
import FlowbiteProvider from "./wrapper/FlowbiteProvider";
import ReduxProvider from "./wrapper/ReduxProvider";
import WagmiProvider from "./wrapper/WagmiProvider";

const providers = [
  ReduxProvider,
  FlowbiteProvider,
  WagmiProvider,
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
