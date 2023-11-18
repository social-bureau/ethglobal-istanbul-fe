import { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { useDeepEffect } from '../hook/useDeepEffect';

export default function AuthGuard({ children }: PropsWithChildren) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  useDeepEffect(() => {
    if (!address || chain?.unsupported) {
      navigate(location?.state?.from || '/unauthorized', {
        state: {
          from: location.pathname,
        },
        replace: true,
      });
    }
  }, [address, navigate, location, chain]);

  return children;
}
