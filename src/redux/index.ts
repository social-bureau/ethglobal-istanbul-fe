import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  TypedUseSelectorHook,
} from "react-redux";
import {
  configureStore,
  combineReducers,
  CombinedState,
  Reducer,
} from "@reduxjs/toolkit";
import layoutSlice, { LayoutReducerState } from "./layout";
import accountSlice, { AccountReducerState } from "./account";
import contractSlice, { ContractReducerState } from "./contract";
import firebaseSlice, { FirebaseReducerState } from "./firebase";

export type ReduxRootState = {
  layout: LayoutReducerState;
  account: AccountReducerState;
  contract: ContractReducerState;
  firebase: FirebaseReducerState;
};

const rootReducer: Reducer<CombinedState<ReduxRootState>> = combineReducers({
  layout: layoutSlice.reducer,
  account: accountSlice.reducer,
  contract: contractSlice.reducer,
  firebase: firebaseSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type StoreDispatch = typeof store.dispatch;
export type StoreGetState = typeof store.getState;

export const useDispatch: () => StoreDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<ReduxRootState> =
  useReduxSelector;

export type RootState = ReturnType<typeof rootReducer>;

export default store;
