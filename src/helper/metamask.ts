import { getSnaps } from './snap';

/**
 * Tries to detect if one of the injected providers is MetaMask and checks if snaps is available in that MetaMask version.
 *
 * @returns True if the MetaMask version supports Snaps, false otherwise.
 */
export const detectSnaps = async () => {
  //@ts-ignore
  if (window.ethereum?.detected) {
    //@ts-ignore
    for (const provider of window.ethereum.detected) {
      try {
        // Detect snaps support
        await getSnaps(provider);

        // enforces MetaMask as provider
        //@ts-ignore
        if (window.ethereum.setProvider) {
          //@ts-ignore
          window.ethereum.setProvider(provider);
        }

        return true;
      } catch {
        // no-op
      }
    }
  }
  //@ts-ignore
  if (window.ethereum?.providers) {
    //@ts-ignore
    for (const provider of window.ethereum.providers) {
      try {
        // Detect snaps support
        await getSnaps(provider);
        //@ts-ignore
        window.ethereum = provider;

        return true;
      } catch {
        // no-op
      }
    }
  }

  try {
    await getSnaps();

    return true;
  } catch {
    return false;
  }
};

/**
 * Detect if the wallet injecting the ethereum object is MetaMask Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
  //@ts-ignore
  const provider = window.ethereum;

  try {
    //@ts-ignore
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};
