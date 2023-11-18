import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { ChatMenuTab, MediaPanel } from "../type/conversation";

export type LayoutReducerState = {
  isOpenSidebar: boolean;
  isShowLoader: boolean;
  isShowAddContact: boolean; // TODO must use type
  activeChatMenuTab: number;
  isShowConversationDetail: boolean;
};

const initialState: LayoutReducerState = {
  isOpenSidebar: true,
  isShowLoader: false,
  isShowAddContact: false,
  activeChatMenuTab: 1,
  isShowConversationDetail: true,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
    toggleIsShowLoader: (state, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
    toggleIsShowAddContact: (state, action: PayloadAction<boolean>) => {
      state.isShowAddContact = action.payload;
    },
    toggleIsShowConversationDetail: (state, action: PayloadAction<boolean>) => {
      state.isShowConversationDetail = action.payload;
    },
  },
});

export const {
  toggleIsOpenSidebar,
  toggleIsShowLoader,
  toggleIsShowAddContact,

  toggleIsShowConversationDetail,
} = layoutSlice.actions;
export default layoutSlice;
