import { useMemo } from "react";
import { providers } from "ethers";
import { useAccount, useBalance, useConnectorClient } from "wagmi";
import { BSC_CHAIN_ID } from "../constants/contracts";

/**
 * Estado global de conexión de wallet — único punto de lectura para la app.
 *
 * Puente wagmi → ethers v5: expone la conexión activa con la misma forma
 * ({ account, provider, chainId }) que usaba useWeb3React, para que el
 * código de contratos existente (ethers v5) siga funcionando sin cambios.
 * Los eventos accountsChanged / chainChanged de la wallet actualizan estos
 * valores reactivamente (los gestiona wagmi).
 */
export function useWallet() {
  const { address, chainId, isConnected, isConnecting, isReconnecting } = useAccount();
  const { data: client } = useConnectorClient();

  // Balance nativo (BNB) de la cuenta conectada, refrescado cada 15 s.
  // react-query dedupe: varios componentes usando useWallet comparten la query.
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    query: { refetchInterval: 15_000 },
  });

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
    /** true mientras se conecta o se restaura la sesión al recargar */
    isConnecting: isConnecting || isReconnecting,
    /** conectado pero fuera de BSC — bloquear acciones de escritura */
    isWrongNetwork: isConnected && chainId !== BSC_CHAIN_ID,
    /** balance BNB formateado (ej. "0.4213") o null si no hay cuenta */
    balance: balanceData ? balanceData.formatted : null,
    balanceSymbol: balanceData?.symbol ?? "BNB",
    balanceLoading,
  };
}
