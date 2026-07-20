import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { fallback, http } from "wagmi";
import { bsc } from "wagmi/chains";

// WalletConnect (QR / móvil) necesita un projectId real de https://cloud.reown.com
// Sin él, las wallets inyectadas (EIP-6963) siguen funcionando igualmente.
const WC_PROJECT_ID = process.env.REACT_APP_WC_PROJECT_ID || "novafi-dev-placeholder";

// RPCs públicos de BSC en orden de preferencia: si uno falla o excede el
// timeout, viem pasa automáticamente al siguiente.
const BSC_RPCS = [
  "https://bsc-dataseed.binance.org/",
  "https://bsc-dataseed1.defibit.io/",
  "https://bsc-dataseed1.ninicoin.io/",
];

export const wagmiConfig = getDefaultConfig({
  appName: "NovaFi",
  projectId: WC_PROJECT_ID,
  chains: [bsc],
  transports: {
    [bsc.id]: fallback(BSC_RPCS.map((url) => http(url, { timeout: 10_000 }))),
  },
  // Lista explícita SIN metaMaskWallet: ese conector arrastra @metamask/sdk,
  // cuyo módulo de analytics rompe en webpack/CRA ("import_openapi_fetch.default
  // is not a function"). MetaMask extensión se detecta igual vía EIP-6963
  // (injectedWallet) y MetaMask móvil entra por el QR de WalletConnect.
  wallets: [
    {
      groupName: "Wallets",
      wallets: [injectedWallet, walletConnectWallet, coinbaseWallet, trustWallet],
    },
  ],
});
