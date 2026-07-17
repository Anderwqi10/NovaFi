import { useMemo } from "react";
import { providers } from "ethers";
import { useAccount, useConnectorClient } from "wagmi";

/**
 * Puente wagmi → ethers v5: expone la conexión activa con la misma forma
 * ({ account, provider, chainId }) que usaba useWeb3React, para que el
 * código de contratos existente (ethers v5) siga funcionando sin cambios.
 */
export function useWallet() {
  const { address, chainId, isConnected } = useAccount();
  const { data: client } = useConnectorClient();

  const provider = useMemo(() => {
    if (!client) return null;
    const network = client.chain
      ? { chainId: client.chain.id, name: client.chain.name }
      : undefined;
    // client.transport es un provider EIP-1193 (tiene .request)
    return new providers.Web3Provider(client.transport as any, network);
  }, [client]);

  return {
    account: (address as string | undefined) ?? null,
    chainId: chainId ?? null,
    provider,
    isConnected,
  };
}
