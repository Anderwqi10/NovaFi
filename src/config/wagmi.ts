import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
  okxWallet,
  binanceWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { fallback, http } from "wagmi";
import { bsc } from "wagmi/chains";

// WalletConnect (QR / mobile) needs a real projectId from https://cloud.reown.com
// Without it, injected wallets (EIP-6963) still work fine.
const WC_PROJECT_ID = process.env.REACT_APP_WC_PROJECT_ID || "novafi-dev-placeholder";

// Public BSC RPCs in order of preference: if one fails or times out,
// viem automatically falls back to the next one.
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
  // Explicit list WITHOUT metaMaskWallet: that connector pulls in @metamask/sdk,
  // whose analytics module breaks under webpack/CRA ("import_openapi_fetch.default
  // is not a function"). MetaMask extension is still detected via EIP-6963
  // (injectedWallet) and MetaMask mobile still connects through the WalletConnect QR.
  //
  // Grouped into two sections so the modal reads with clear priority:
  // "Recommended" covers the common case (extension already installed + universal
  // mobile QR), "More wallets" are dedicated connectors for specific wallets the
  // user may not have auto-detected.
  wallets: [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, walletConnectWallet],
    },
    {
      groupName: "More wallets",
      wallets: [okxWallet, binanceWallet, coinbaseWallet, trustWallet],
    },
  ],
});
