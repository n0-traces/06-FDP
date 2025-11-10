import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const NetworkStatus: React.FC = () => {
  const { network, isConnected } = useWallet();

  if (!isConnected || !network) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-white rounded-lg shadow-lg border p-3 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900">网络状态</span>
        </div>
        <div className="text-xs text-gray-600">
          <div>网络: {network.name}</div>
          <div>链ID: {network.chainId}</div>
          <div>代币: {network.nativeCurrency.symbol}</div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;
