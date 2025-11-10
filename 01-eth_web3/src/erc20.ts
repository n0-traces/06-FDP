import { ethers } from "ethers";

export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export interface TransferParams {
  contractAddress: string;
  to: string;
  amount: string;
  decimals?: number;
  provider?: ethers.BrowserProvider | ethers.JsonRpcProvider;
}

export const transferERC20 = async ({
  contractAddress,
  to,
  amount,
  decimals = 18,
  provider
}: TransferParams) => {
  const safeProvider =
    provider ??
    (() => {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("请提供 provider 参数或在浏览器中连接 MetaMask");
      }
      return new ethers.BrowserProvider(window.ethereum);
    })();

  const signer = await safeProvider.getSigner();
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer);

  const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
  return tx.wait();
};

