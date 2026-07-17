import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

/**
 * Cambia la wallet a la red indicada. Si la wallet no tiene la red
 * agregada, wagmi envía wallet_addEthereumChain automáticamente
 * (la red debe estar declarada en src/config/wagmi.ts).
 */
export function useSwitchChain() {
  const { switchChainAsync } = useWagmiSwitchChain();

  return async (desiredChain: number) => {
    await switchChainAsync({ chainId: desiredChain });
  };
}
