import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const ConnectionStatus: React.FC = () => {
  const { isConnected, account, network } = useWallet();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showStatus, setShowStatus] = useState<boolean>(false);

  useEffect(() => {
    if (isConnected && account) {
      setStatusMessage(`已连接到 ${account.address.slice(0, 6)}...${account.address.slice(-4)}`);
      setShowStatus(true);
      
      // 3秒后隐藏状态消息
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setStatusMessage('钱包已断开连接');
      setShowStatus(true);
      
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, account]);

  if (!showStatus) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">{statusMessage}</span>
        </div>
        {network && (
          <div className="text-xs text-gray-600 mt-1">
            网络: {network.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
