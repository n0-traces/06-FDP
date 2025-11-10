import { ethers } from "ethers";

export interface GeneratedWallet {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

/**
 * 随机生成钱包信息（仅用于学习演示，不建议生产环境使用）
 */
export const createWallet = (): GeneratedWallet => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase
  };
};

/**
 * 连接浏览器中的 MetaMask，并返回 signer
 */
export const connectMetaMask = async (): Promise<ethers.Signer> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("未检测到浏览器环境或 MetaMask");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

