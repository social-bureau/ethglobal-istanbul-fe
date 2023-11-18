// import { PropsWithChildren, useCallback } from 'react';
// import { useDeepEffect } from '../hook/useDeepEffect';
// import {
//   useInitWeb3InboxClient,
//   useManageSubscription,
//   useW3iAccount,
// } from '@web3inbox/widget-react';
// import {
//   useAccount,
//   // usePublicClient,
//   useSignMessage,
// } from 'wagmi';
// import environment from '../environment';

// const projectId = environment.walletconnectProjectId;
// const domain = environment.web3InboxDomain;

// export default function Web3InboxPortal({ children }: PropsWithChildren) {
//   const isW3iInitialized = useInitWeb3InboxClient({
//     projectId,
//     domain,
//     isLimited: false,
//   });
//   const { address } = useAccount({
//     onDisconnect: () => {
//       setAccount('');
//     },
//   });
//   const {
//     account,
//     setAccount,
//     register: registerIdentity,
//     identityKey,
//   } = useW3iAccount();
//   const {
//     subscribe,
//     //   unsubscribe,
//     //   isSubscribed,
//     //   isSubscribing,
//     //   isUnsubscribing,
//   } = useManageSubscription(account);
//   const { signMessageAsync } = useSignMessage();
//   //   const wagmiPublicClient = usePublicClient();

//   const signMessage = useCallback(
//     async (message: string) => {
//       const res = await signMessageAsync({
//         message,
//       });

//       return res as string;
//     },
//     [signMessageAsync]
//   );

//   useDeepEffect(() => {
//     if (!address) return;
//     setAccount(`eip155:1:${address}`);
//   }, [signMessage, address, setAccount]);

//   const handleRegistration = useCallback(async () => {
//     if (!account) return;
//     try {
//       await registerIdentity(signMessage);
//     } catch (registerIdentityError) {
//       console.error({ registerIdentityError });
//     }
//   }, [signMessage, registerIdentity, account]);

//   useDeepEffect(() => {
//     // register even if an identity key exists, to account for stale keys
//     handleRegistration();
//   }, [handleRegistration]);

//   const handleSubscribe = useCallback(async () => {
//     if (!identityKey) {
//       await handleRegistration();
//     }
//     await subscribe();
//   }, [subscribe, identityKey]);

//   useDeepEffect(() => {
//     if (address && account) {
//       handleSubscribe();
//     }
//   }, [address, account]);

//   console.log({ isW3iInitialized });

//   return <>{children}</>;
// }

import {
  useManageSubscription,
  useSubscription,
  useW3iAccount,
  useInitWeb3InboxClient,
  useMessages,
} from '@web3inbox/widget-react';
import { PropsWithChildren, useCallback } from 'react';
import { useSignMessage, useAccount } from 'wagmi';
import environment from '../environment';
import { useDeepEffect } from '../hook/useDeepEffect';

const projectId = environment.walletconnectProjectId;
const domain = environment.web3InboxDomain;

export default function Web3InboxPortal({ children }: PropsWithChildren) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const isReady = useInitWeb3InboxClient({
    projectId,
    domain,
    isLimited: false,
  });

  const { account, setAccount, isRegistered, isRegistering, register } =
    useW3iAccount();

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription();

  useDeepEffect(() => {
    if (!address) return;
    setAccount(`eip155:1:${address}`);
  }, [address, setAccount]);

  const performRegistration = useCallback(async () => {
    if (!address) return;
    try {
      await register(message => signMessageAsync({ message }));
    } catch (registerIdentityError) {
      alert(registerIdentityError);
    }
  }, [signMessageAsync, register, address]);

  useDeepEffect(() => {
    performRegistration();
  }, [performRegistration]);

  const performSubscribe = useCallback(async () => {
    await performRegistration();
    await subscribe();
  }, [subscribe, isRegistered]);

  const { subscription } = useSubscription();
  const { messages } = useMessages();

  console.log(isReady);
  console.log(account);
  console.log(subscription);
  console.log(messages);
  console.log(isRegistering);
  console.log(performSubscribe);
  console.log(isSubscribed, isSubscribing);

  return (
    <>
      {/* {!isSubscribed ? (
        <>
          <button onClick={performSubscribe} disabled={isSubscribing}>
            {isSubscribing ? 'Subscribing...' : 'Subscribe to notifications'}
          </button>
        </>
      ) : (
        <>
          <div>You are subscribed</div>
          <div>Subscription: {JSON.stringify(subscription)}</div>
          <div>Messages: {JSON.stringify(messages)}</div>
        </>
      )} */}
      {/* <>
        <div>You are subscribed</div>
        <div>Subscription: {JSON.stringify(subscription)}</div>
        <div>Messages: {JSON.stringify(messages)}</div>
      </> */}
      {children}
    </>
  );

  //   return (
  //     <>
  //       {!isReady ? (
  //         <div>Loading client...</div>
  //       ) : (
  //         <>
  //           {!address ? (
  //             <div>Connect your wallet</div>
  //           ) : (
  //             <>
  //               <div>Address: {address}</div>
  //               <div>Account ID: {account}</div>
  //               {!isRegistered ? (
  //                 <div>
  //                   To manage notifications, sign and register an identity
  //                   key:&nbsp;
  //                   <button
  //                     onClick={performRegistration}
  //                     disabled={isRegistering}>
  //                     {isRegistering ? 'Signing...' : 'Sign'}
  //                   </button>
  //                 </div>
  //               ) : (
  //                 <>
  //                   {!isSubscribed ? (
  //                     <>
  //                       <button
  //                         onClick={performSubscribe}
  //                         disabled={isSubscribing}>
  //                         {isSubscribing
  //                           ? 'Subscribing...'
  //                           : 'Subscribe to notifications'}
  //                       </button>
  //                     </>
  //                   ) : (
  //                     <>
  //                       <div>You are subscribed</div>
  //                       <div>Subscription: {JSON.stringify(subscription)}</div>
  //                       <div>Messages: {JSON.stringify(messages)}</div>
  //                     </>
  //                   )}
  //                 </>
  //               )}
  //             </>
  //           )}
  //         </>
  //       )}
  //     </>
  //   );
}
