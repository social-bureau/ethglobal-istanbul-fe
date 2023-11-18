/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from 'react-toastify';
import { errorFormat } from '../../helper/error-format';
import { createLensProfile, getLensProfile } from '../../helper/lens';
import { useDeepEffect } from '../../hook/useDeepEffect';
import { useSelector } from '../../redux';
import { useState } from 'react';
import { useNetwork } from 'wagmi';
import { updateLensProfile } from '../../rest-api/conversation';
import { TextInput } from 'flowbite-react';

export default function Setting() {
  const { chain } = useNetwork();
  const [lensHandle, setLensHandle] = useState('');
  const { user } = useSelector(state => state.account);
  const [lensProfile, setLensProfile] = useState<any>(null);

  console.log({ user });

  useDeepEffect(() => {
    (async () => {
      if (user) {
        const profile = await getLensProfile(user.lensId);
        if (profile) {
          console.log(profile.handle?.fullHandle);
          setLensProfile(profile);
        }
      }
    })();
  }, [user]);

  const createLens = async () => {
    try {
      if (user) {
        const createResponse = await createLensProfile(
          user.publicAddress,
          lensHandle
        );

        if (createResponse) {
          await updateLensProfile(createResponse.items[0].id);
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    } finally {
      setLensHandle('');
    }
  };

  console.log(chain);

  return (
    <section className="bg-white dark:bg-gray-900 flex justify-center w-full">
      <div className="py-8 px-12 mx-auto w-full sm:py-16 lg:px-6 ">
        <h2 className="mb-6 lg:mb-8 text-3xl lg:text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Settings
        </h2>
        <div className="mx-auto w-full">
          {chain?.id === 80001 && (
            <>
              <h2 id="accordion-flush-heading-2">
                <div className="flex justify-between items-center py-5 w-full font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                  <span>Lens profile</span>
                  {lensProfile ? (
                    <>@{lensProfile?.handle?.fullHandle}</>
                  ) : (
                    <div>
                      <TextInput
                        className="w-full bg-gray-50 border-gray-300"
                        placeholder="Enter wallet address "
                        sizing="md"
                        value={lensHandle}
                        onChange={e => setLensHandle(e.target.value)}
                      />
                      <button onClick={() => createLens()}>create</button>
                    </div>
                  )}
                </div>
              </h2>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
