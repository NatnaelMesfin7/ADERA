import { createConfig, http } from "wagmi";
import { moonbaseAlpha } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { env, hasWalletConnectProjectId } from "@/config/env";

const connectors = hasWalletConnectProjectId
  ? [
      injected(),
      walletConnect({
        projectId: env.walletConnectProjectId,
        showQrModal: true,
      }),
    ]
  : [injected()];

export const wagmiConfig = createConfig({
  chains: [moonbaseAlpha],
  connectors,
  transports: {
    [moonbaseAlpha.id]: http(env.testnetRpcUrl),
  },
  ssr: true,
});
