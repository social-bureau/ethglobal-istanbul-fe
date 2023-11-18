/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from 'react-toastify';
import { errorFormat } from '../../helper/error-format';
import { createLensProfile, getLensProfile } from '../../helper/lens';
import { useDeepEffect } from '../../hook/useDeepEffect';
import { useSelector } from '../../redux';
import { useState } from 'react';

export default function Setting() {
  const { user } = useSelector(state => state.account);
  const [lensProfile, setLensProfile] = useState<any>(null);

  useDeepEffect(() => {
    (async () => {
      const profile = await getLensProfile('0x0481');
      if (profile) {
        console.log(profile.handle?.fullHandle);
        setLensProfile(profile);
      }
    })();
  }, []);

  const createLens = async () => {
    try {
      if (user) {
        const handle = 'ikhaqqqq';
        const createResponse = await createLensProfile(
          user.publicAddress,
          handle
        );

        // 0x0481
        console.log(createResponse.items);
      }
    } catch (error) {
      toast.error(errorFormat(error).message);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 flex justify-center w-full">
      <div className="py-8 px-12 mx-auto w-full sm:py-16 lg:px-6 ">
        <h2 className="mb-6 lg:mb-8 text-3xl lg:text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Settings
        </h2>
        <div className="mx-auto w-full">
          <div className="w-full">
            <h2 id="accordion-flush-heading-2">
              <button
                type="button"
                className="flex justify-between items-center py-5 w-full font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
                data-accordion-target="#accordion-flush-body-2"
                aria-expanded="false"
                aria-controls="accordion-flush-body-2">
                <span>Lens profile</span>
                {lensProfile ? (
                  <>@{lensProfile.handle?.fullHandle}</>
                ) : (
                  <button onClick={() => createLens()}>create</button>
                )}
              </button>
            </h2>
            <div
              id="accordion-flush-body-2"
              className="hidden"
              aria-labelledby="accordion-flush-heading-2">
              <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Flowbite is first conceptualized and designed using the Figma
                  software so everything you see in the library has a design
                  equivalent in our Figma file.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Check out the{' '}
                  <a
                    href="#"
                    className="text-primary-600 dark:text-primary-500 hover:underline">
                    Figma design system
                  </a>{' '}
                  based on the utility classes from Tailwind CSS and components
                  from Flowbite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
