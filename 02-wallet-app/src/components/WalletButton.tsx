import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import WalletModal from './WalletModal';

const WalletButton: React.FC = () => {
  const { isConnected, isConnecting, connectWallet, disconnectWallet, account } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      setIsModalOpen(false);
    } catch (error) {
      console.error('连接钱包失败:', error);
      // 这里可以添加错误提示
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">
            {formatAddress(account.address)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="btn-secondary text-sm"
        >
          断开连接
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>连接中...</span>
          </div>
        ) : (
          '连接钱包'
        )}
      </button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWallet={handleConnect}
        isConnecting={isConnecting}
      />
    </>
  );
};

export default WalletButton;
