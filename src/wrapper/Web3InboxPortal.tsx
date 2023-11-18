import { PropsWithChildren, useCallback } from 'react';
import { useDeepEffect } from '../hook/useDeepEffect';
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from '@web3inbox/widget-react';
import {
  useAccount,
  // usePublicClient,
  useSignMessage,
} from 'wagmi';
import environment from '../environment';

const projectId = environment.walletconnectProjectId;
const domain = environment.web3InboxDomain;

export default function Web3InboxPortal({ children }: PropsWithChildren) {
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain,
    isLimited: false,
  });
  const { address } = useAccount({
    onDisconnect: () => {
      setAccount('');
    },
  });
  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();
  const {
    subscribe,
    //   unsubscribe,
    //   isSubscribed,
    //   isSubscribing,
    //   isUnsubscribing,
  } = useManageSubscription(account);
  const { signMessageAsync } = useSignMessage();
  //   const wagmiPublicClient = usePublicClient();

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  useDeepEffect(() => {
    if (!address) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  useDeepEffect(() => {
    // register even if an identity key exists, to account for stale keys
    handleRegistration();
  }, [handleRegistration]);

  const handleSubscribe = useCallback(async () => {
    if (!identityKey) {
      await handleRegistration();
    }
    await subscribe();
  }, [subscribe, identityKey]);

  useDeepEffect(() => {
    if (address && account) {
      handleSubscribe();
    }
  }, [address, account]);

  console.log({ isW3iInitialized });

  return <>{children}</>;
}
