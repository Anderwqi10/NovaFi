import { useSwitchChain as useWagmiSwitchChain } from "wagmi";

/**
 * Cambia la wallet a la red indicada. Si la wallet no tiene la red
 * agregada, wagmi envía wallet_addEthereumChain automáticamente
 * (la red debe estar declarada en src/config/wagmi.ts).
 */
export function useSwitchChain() {
  const { switchChainAsync } = useWagmiSwitchChain();

  return async (desiredChain: number) => {
    try {
      await switchChainAsync({ chainId: desiredChain });
    } catch (err: any) {
      // 4001 / UserRejectedRequestError: el usuario canceló en la wallet — no es un error
      if (err?.code !== 4001 && err?.name !== "UserRejectedRequestError") {
        console.error("switchChain failed:", err);
      }
    }
  };
}
