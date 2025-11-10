import { ethers } from "ethers";

const UNISWAP_ROUTER_ABI = [
  "function swapExactTokensForTokens(uint256 amountIn,uint256 amountOutMin,address[] calldata path,address to,uint256 deadline) returns (uint256[] memory)",
  "function getAmountsOut(uint256 amountIn, address[] calldata path) view returns (uint256[] memory)"
];

export interface SwapParams {
  routerAddress: string;
  path: string[];
  amountIn: string;
  amountOutMin?: string;
  decimals?: number;
  deadlineMinutes?: number;
  provider?: ethers.BrowserProvider | ethers.JsonRpcProvider;
}

export const swapTokens = async ({
  routerAddress,
  path,
  amountIn,
  amountOutMin,
  decimals = 18,
  deadlineMinutes = 20,
  provider
}: SwapParams) => {
  if (path.length < 2) {
    throw new Error("path 至少包含两个地址");
  }

  const safeProvider =
    provider ??
    (() => {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("请提供 provider 参数或在浏览器中连接 MetaMask");
      }
      return new ethers.BrowserProvider(window.ethereum);
    })();

  const signer = await safeProvider.getSigner();
  const router = new ethers.Contract(routerAddress, UNISWAP_ROUTER_ABI, signer);

  const deadline = Math.floor(Date.now() / 1000) + 60 * deadlineMinutes;
  const amountInWei = ethers.parseUnits(amountIn, decimals);
  const minOut = amountOutMin ? ethers.parseUnits(amountOutMin, decimals) : 0n;

  const tx = await router.swapExactTokensForTokens(amountInWei, minOut, path, await signer.getAddress(), deadline);
  return tx.wait();
};

export const getAmountsOut = async ({
  routerAddress,
  path,
  amountIn,
  decimals = 18,
  provider
}: Omit<SwapParams, "deadlineMinutes" | "amountOutMin">) => {
  const safeProvider =
    provider ??
    (() => {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("请提供 provider 参数或在浏览器中连接 MetaMask");
      }
      return new ethers.BrowserProvider(window.ethereum);
    })();

  const signer = await safeProvider.getSigner();
  const router = new ethers.Contract(routerAddress, UNISWAP_ROUTER_ABI, signer);
  const amounts = await router.getAmountsOut(ethers.parseUnits(amountIn, decimals), path);
  return amounts.map((value: bigint) => ethers.formatUnits(value, decimals));
};

