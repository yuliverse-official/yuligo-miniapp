import { createContext, ReactNode, useState } from 'react';
import { CHAIN } from '@tonconnect/ui-react';
import { useTonConnect } from '@/hooks/useTonConnect';
import { useAsyncInitialize } from '@/hooks/useAsyncInitialize';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from 'ton';


type TonClientProvider = {
  children: ReactNode
};

type TonClientContextProviderValue = {
  tonClient: TonClient | undefined
}

const initialContext = {
  tonClient: undefined,
};

export const TonClientContext = createContext<TonClientContextProviderValue>(initialContext);

export const TonClientProvider = ({ children }: TonClientProvider) => {
  const { network } = useTonConnect();
  const [client, setClient] = useState<TonClient>();

  useAsyncInitialize(async () => {
    if (!network) return;

    const endpoint = await getHttpEndpoint({
      network: network === CHAIN.MAINNET ? 'mainnet' : 'testnet',
    });

    const tonClient = new TonClient({ endpoint });
    setClient(tonClient);
  }, [network]);


  return (
    <TonClientContext.Provider value={{ tonClient: client }}>
      {children}
    </TonClientContext.Provider>
  );
};
