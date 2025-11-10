import { ethers } from "ethers";
import { ERC20_ABI } from "./erc20";

export interface MonitorOptions {
  contractAddress: string;
  network?: string;
  providerUrl?: string;
  onTransfer?: (from: string, to: string, value: bigint) => void;
}

export const monitorTransfers = ({
  contractAddress,
  network = "mainnet",
  providerUrl,
  onTransfer
}: MonitorOptions) => {
  const provider = providerUrl ? new ethers.JsonRpcProvider(providerUrl) : ethers.getDefaultProvider(network);
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

  contract.on("Transfer", (from: string, to: string, value: bigint) => {
    onTransfer?.(from, to, value);
    console.log(`Transfer: ${ethers.formatUnits(value, 18)} from ${from} to ${to}`);
  });

  return () => contract.removeAllListeners("Transfer");
};

