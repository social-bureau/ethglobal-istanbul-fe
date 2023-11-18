import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { omit, isEmpty, isArray } from 'lodash';
import { StoreDispatch, StoreGetState } from '.';
import { initialPageInfoValue } from '../constant/page-info';
import { PageInfo, PaginateParams } from '../type/common';
import { queryParamsToString } from '../helper/formater';
import { errorFormat } from '../helper/error-format';
import {
  getConversationApi,
  getMessagesApi,
  sendTextMessageApi,
} from '../rest-api/conversation';
import { Participant } from '../type/conversation';
import {
  ChatBubbleAlign,
  MessageWithAlignAndSentStatus,
  Message,
  SendingMessageState,
} from '../type/message';
import { getReceiver } from '../helper/conversation';
import { Contract } from 'ethers';
import { CryptoAES256, CryptoECIES, generateSecret } from '../helper/crypto';
import {
  backgroundUpdateConversation,
  setSelectedConversation,
} from './conversation';

export type MessageReducerState = {
  messages: MessageWithAlignAndSentStatus[];
  participants: Participant[];
  pageInfo: PageInfo;
  query: PaginateParams;
  chatScheme: CryptoAES256 | null;
  initialzing: boolean;
  loadingMore: boolean;
  backgroundUpdating: boolean;
  error: boolean;
};

const initialState: MessageReducerState = {
  messages: Array<MessageWithAlignAndSentStatus>(),
  participants: Array<Participant>(),
  pageInfo: initialPageInfoValue,
  query: {
    page: 1,
    limit: 15,
  },
  chatScheme: null,
  initialzing: false,
  loadingMore: false,
  backgroundUpdating: false,
  error: false,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // initialization
    initializingMessage: state => {
      state.initialzing = true;
    },
    initializeMessageSuccess: (
      state,
      action: PayloadAction<{
        messages: MessageWithAlignAndSentStatus[];
        participants: Participant[];
        pageInfo: PageInfo;
        chatScheme: CryptoAES256;
      }>
    ) => {
      state.messages = action.payload.messages;
      state.participants = action.payload.participants;
      state.chatScheme = action.payload.chatScheme;
      state.pageInfo = action.payload.pageInfo;
      state.initialzing = false;
    },
    // background update
    backgroundUpdatingMessage: state => {
      state.backgroundUpdating = true;
    },
    backgroundUpdateMessageSuccess: (
      state,
      action: PayloadAction<{
        messages: MessageWithAlignAndSentStatus[];
        participants: Participant[];
        pageInfo: PageInfo;
      }>
    ) => {
      state.messages = action.payload.messages;
      state.participants = action.payload.participants;
      state.pageInfo = action.payload.pageInfo;
      state.backgroundUpdating = false;
    },
    updateSendingMessage: (
      state,
      action: PayloadAction<{
        messages: MessageWithAlignAndSentStatus[];
      }>
    ) => {
      state.messages = action.payload.messages;
    },
    // other
    fetchMessageFailure: () => {
      return { ...initialState, initialzing: false, error: true };
    },
    reset: () => initialState,
  },
});

const {
  initializingMessage,
  initializeMessageSuccess,
  backgroundUpdatingMessage,
  backgroundUpdateMessageSuccess,
  updateSendingMessage,
  fetchMessageFailure,
  reset,
} = messageSlice.actions;

export const setDefaultMessageState = reset;

export const initializeMessage =
  (conversationIdParam: string) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { query } = getState().message;
      const { user, userScheme } = getState().account;
      const { contract } = getState().contract;

      if (isEmpty(contract)) {
        throw new Error('Contract not found.');
      }

      if (isEmpty(user) || isEmpty(userScheme)) {
        throw new Error('User public address not found.');
      }
      dispatch(initializingMessage());

      const messageResponse = await fetchMessage(query, conversationIdParam);

      console.log(messageResponse);

      const peer = getReceiver(messageResponse.participants, user);
      if (isEmpty(peer)) {
        throw new Error('Peer public address not found.');
      }

      const chatScheme = await getChatScheme(
        contract,
        peer.publicAddress,
        user.publicAddress,
        userScheme
      );

      const conversation = await getConversationApi(conversationIdParam);
      if (isEmpty(conversation)) {
        throw new Error('Conversation not found.');
      }
      dispatch(
        setSelectedConversation({
          selectedConversation: conversation,
        })
      );

      dispatch(
        initializeMessageSuccess({
          messages: prepareMessages(
            messageResponse.conversationMessages.results,
            user.publicAddress
          ),
          participants: messageResponse.participants,
          pageInfo: omit(messageResponse.conversationMessages, ['results']),
          chatScheme,
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(errorFormat(error).message);
      dispatch(fetchMessageFailure());
    }
  };

export const backgroundUpdateMessage =
  () => async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { selectedConversation } = getState().conversation;
      if (!selectedConversation) {
        return;
      }

      dispatch(backgroundUpdatingMessage());
      const { query } = getState().message;
      const { user, userScheme } = getState().account;

      if (isEmpty(user) || isEmpty(userScheme)) {
        throw new Error('User public address not found.');
      }

      const messageResponse = await fetchMessage(
        query,
        selectedConversation.conversation.id
      );

      dispatch(
        backgroundUpdateMessageSuccess({
          messages: prepareMessages(
            messageResponse.conversationMessages.results,
            user.publicAddress
          ),
          participants: messageResponse.participants,
          pageInfo: omit(messageResponse.conversationMessages, ['results']),
        })
      );
    } catch (error) {
      toast.error(errorFormat(error).message);
      dispatch(fetchMessageFailure());
    }
  };

export const receiveMessage =
  (inComingMessage: Message) =>
  (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { selectedConversation } = getState().conversation;
      dispatch(backgroundUpdateConversation());
      if (
        selectedConversation?.conversation.id === inComingMessage.conversationId
      ) {
        dispatch(backgroundUpdateMessage());
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
      dispatch(fetchMessageFailure());
    }
  };

export const sendMessage =
  (messageState: SendingMessageState) =>
  async (dispatch: StoreDispatch, getState: StoreGetState) => {
    try {
      const { selectedConversation } = getState().conversation;
      const { chatScheme, messages } = getState().message;
      const { user } = getState().account;

      const { content, type, optional = {} } = messageState;

      if (isEmpty(selectedConversation)) {
        throw new Error('Selected Conversation not found.');
      }

      if (isEmpty(user)) {
        throw new Error('User not found.');
      }

      if (isEmpty(chatScheme)) {
        throw new Error('Chat scheme not found.');
      }

      const cypherText = chatScheme
        .encrypt(Buffer.from(content))
        .toString('hex');

      const sendingMessage: MessageWithAlignAndSentStatus = {
        id: Date.now().toString(),
        senderId: user?.publicAddress,
        conversationId: selectedConversation.conversation.id,
        content: cypherText,
        contentType: type!,
        optional,
        createdAt: {
          _nanoseconds: Date.now(),
          _seconds: Date.now(),
        },
        updatedAt: {
          _nanoseconds: Date.now(),
          _seconds: Date.now(),
        },
        sent: false,
        align: ChatBubbleAlign.Right,
      };

      dispatch(
        updateSendingMessage({ messages: [sendingMessage, ...messages] })
      );

      await sendTextMessageApi(
        selectedConversation.conversation.id,
        cypherText,
        type!,
        optional
      );

      dispatch(backgroundUpdateMessage());
      dispatch(backgroundUpdateConversation());
    } catch (error) {
      toast.error(errorFormat(error).message);
    }
  };

// Private
const fetchMessage = async (
  query: PaginateParams,
  conversationIdParam: string
) => {
  const queryParams = queryParamsToString({ ...query });
  const messageResponse = await getMessagesApi(
    conversationIdParam,
    queryParams
  );
  if (isEmpty(messageResponse)) {
    throw new Error('Message response is empty.');
  }
  if (!isArray(messageResponse.conversationMessages.results)) {
    throw new Error('Messages is not found.');
  }
  return messageResponse;
};

const prepareMessages = (
  messages: Message[],
  userAddress: string
): MessageWithAlignAndSentStatus[] => {
  const messageWithAlignAndSentStatus = messages.map(msg => {
    const align: ChatBubbleAlign =
      msg.senderId === userAddress
        ? ChatBubbleAlign.Right
        : ChatBubbleAlign.Left;
    return {
      ...msg,
      align,
      sent: true,
    };
  });
  return messageWithAlignAndSentStatus;
};

const getChatScheme = async (
  contract: Contract,
  peerAddress: string,
  userAddress: string,
  userScheme: CryptoECIES
) => {
  const isChatInitialized = await contract.callStatic.isChatInitialized(
    userAddress,
    peerAddress
  );

  let chatSecret: Buffer | null = null;

  if (isChatInitialized) {
    const chatSecretEncrypted = await contract.callStatic.getChatInitialization(
      userAddress,
      peerAddress
    );
    const encryptedChatSecret = Buffer.from(
      chatSecretEncrypted.slice(2),
      'hex'
    );
    chatSecret = userScheme.decrypt(encryptedChatSecret);
  } else {
    // generate secret from chat scheme
    chatSecret = generateSecret();

    // fetch peer's public key
    const peerInit =
      await contract.callStatic.getUserInitialization(peerAddress);

    // encrypt for peer
    const peerPublicKey = Buffer.from(
      (peerInit.publicKeyPrefix ? '02' : '03') + peerInit.publicKeyX.slice(2),
      'hex'
    );
    const chatSecretEncryptedForPeer = CryptoECIES.encrypt(
      peerPublicKey.toString('hex'),
      chatSecret
    );
    const chatSecretEncryptedForMe = userScheme.encrypt(chatSecret);

    // initialize chat and update state
    const tx = await contract.initializeChat(
      chatSecretEncryptedForMe,
      chatSecretEncryptedForPeer,
      peerAddress
    );
    await tx.wait();
  }

  const chatScheme = new CryptoAES256(chatSecret);
  return chatScheme;
};

export default messageSlice;
