import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const Header: React.FC = () => {
  const { isConnected, account, network, disconnectWallet, isConnecting } = useWallet();

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">W3</div>
          <span className="text-lg font-semibold text-gray-900">Web3 钱包应用</span>
        </div>

        <div className="flex items-center space-x-3">
          {isConnected && account && (
            <>
              {network && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {network.name}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                {formatAddress(account.address)}
              </span>
              <button
                onClick={disconnectWallet}
                disabled={isConnecting}
                className="btn-secondary py-1 px-3 text-sm"
              >
                断开连接
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
