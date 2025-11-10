export interface WalletAccount {
  address: string;
  balance: string;
}

export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface WalletContextType {
  account: WalletAccount | null;
  network: Network | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

export type WalletType = 'metamask' | 'coinbase';

export const SUPPORTED_NETWORKS: Record<number, Network> = {
  [Number(`${import.meta.env.VITE_ALCHEMY_MAINNET_CHAINID}`)] : {
    chainId: Number(`${import.meta.env.VITE_ALCHEMY_MAINNET_CHAINID}`),
    name: 'Ethereum Mainnet',
    rpcUrl: `${import.meta.env.VITE_ALCHEMY_MAINNET_URL}`,
    blockExplorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',   
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [Number(`${import.meta.env.VITE_SEPOLIA_CHAINID}`)] : {
    chainId: import.meta.env.VITE_SEPOLIA_CHAINID,
    name: 'Sepolia Testnet',
    rpcUrl: import.meta.env.VITE_SEPOLIA_URL,
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};
