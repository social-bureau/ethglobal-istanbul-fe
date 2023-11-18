// Import Push SDK & Ethers
import { ProgressHookType, PushAPI } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { ethers } from 'ethers';

// Using random signer from a wallet, ideally this is the wallet you will connect

export const pushNotification = async (
  participantAddress: string,
  title: string,
  body: string
) => {
  console.log('send noti');
  const pushApi = await getPushApi();

  const apiResponse = await pushApi.channel.send([participantAddress], {
    notification: {
      title,
      body,
    },
  });

  console.log(apiResponse);
};

export const createChannel = async () => {
  const pushApi = await getPushApi();

  const response = await pushApi.channel.create({
    name: 'Test Channel',
    description: 'Test Description',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
    url: 'https://push.org',
    progressHook: onboardingProgressReformatter,
  });

  console.log('channel created ');
  console.log(response);
};

const getPushApi = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  const signer = provider.getSigner();
  const pushApi = await PushAPI.initialize(signer, { env: ENV.STAGING });
  return pushApi;
};

const onboardingProgressReformatter = (progressHook: ProgressHookType) => {
  const onboardingProgress: onboardingProgressI = {
    enabled: true,
    hookInfo: progressHook,
    spinnerType: LOADER_SPINNER_TYPE.PROCESSING,
    progress: 0,
  };

  if (progressHook) {
    switch (progressHook.progressId) {
      case 'PUSH-CREATE-01':
        onboardingProgress.hookInfo.progressTitle = 'Creating Push Profile';
        onboardingProgress.progress = 10;
        break;
      case 'PUSH-CREATE-02':
        onboardingProgress.hookInfo.progressTitle = '1/3 - Profile Generation';
        onboardingProgress.progress = 25;
        break;
      case 'PUSH-CREATE-03':
        onboardingProgress.hookInfo.progressTitle = '2/3 - Profile Encryption';
        onboardingProgress.progress = 50;
        break;
      case 'PUSH-CREATE-04':
        onboardingProgress.hookInfo.progressTitle = '3/3 - Profile Sync';
        onboardingProgress.progress = 75;
        break;
      case 'PUSH-CREATE-05':
        onboardingProgress.hookInfo.progressTitle = 'Push Profile Created';
        onboardingProgress.progress = 99;
        break;
      case 'PUSH-DECRYPT-01':
        onboardingProgress.hookInfo.progressTitle = 'Decrypting Push Profile';
        break;
      case 'PUSH-DECRYPT-02':
        onboardingProgress.enabled = false;
        onboardingProgress.hookInfo.progressTitle = 'Push Profile Unlocked';
        break;
      case 'PUSH-UPGRADE-01':
        onboardingProgress.hookInfo.progressTitle = '1/4 - Profile Generation';
        onboardingProgress.progress = 35;
        break;
      case 'PUSH-UPGRADE-02':
        onboardingProgress.hookInfo.progressTitle =
          '2/4 - Decrypting Old Profile';
        onboardingProgress.progress = 50;
        break;
      case 'PUSH-UPGRADE-03':
        onboardingProgress.hookInfo.progressTitle =
          '3/4 - New Profile Encryption';
        onboardingProgress.progress = 75;
        break;
      case 'PUSH-UPGRADE-04':
        onboardingProgress.hookInfo.progressTitle = '4/4 - Profile Sync';
        onboardingProgress.progress = 90;
        break;
      case 'PUSH-UPGRADE-05':
        onboardingProgress.hookInfo.progressTitle = 'Push Profile Upgraded';
        onboardingProgress.progress = 99;
        break;
      case 'PUSH-ERROR-00':
        onboardingProgress.hookInfo.progressTitle = 'User Rejected Signature';
        onboardingProgress.spinnerType = LOADER_SPINNER_TYPE.ERROR;
        break;
      case 'PUSH-ERROR-01':
        onboardingProgress.hookInfo.progressTitle = 'Upgrade Failed';
        onboardingProgress.spinnerType = LOADER_SPINNER_TYPE.ERROR;
        break;
      case 'PUSH-ERROR-02':
        onboardingProgress.hookInfo.progressTitle = 'Decrypting Keys Failed';
        onboardingProgress.spinnerType = LOADER_SPINNER_TYPE.ERROR;
        break;
    }
  }

  console.log(onboardingProgress);
};

interface onboardingProgressI {
  enabled: boolean;
  hookInfo: ProgressHookType;
  spinnerType: number;
  progress: number;
}

const LOADER_SPINNER_TYPE = {
  PROCESSING: 1,
  WARNING: 2,
  ERROR: 3,
  COMPLETED: 4,
  WHITELIST: 5,
};
