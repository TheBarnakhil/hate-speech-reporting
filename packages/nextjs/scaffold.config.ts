
export type ScaffoldConfig = {
  targetNetworks: any;
  pollingInterval: number;
  walletConnectProjectId: string;
};

export const galadrielNetwork = {
  id: 696969,
  name: "Galadriel Devnet",
  network: "galadriel",
  nativeCurrency: {
    decimals: 18,
    name: "GAL",
    symbol: "GAL",
  },
  rpcUrls: {
    default: { http: ["https://devnet.galadriel.com"] },
  },
  blockExplorers: {
    default: {
      name: "Galadriel Explorer",
      url: "https://explorer.galadriel.com",
    },
  },
  contracts: {
    HateSpeechAgent: {
      address: "0xA1E54Aa7B39431B2D6C36fB09b7842E3c559f722",
    },
  },
};

const scaffoldConfig = {

  targetNetworks: [galadrielNetwork],

  pollingInterval: 30000,

  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string ,

} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
