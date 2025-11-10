import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const AccountInfo: React.FC = () => {
  const { account, network, refreshBalance, isConnected, disconnectWallet, isConnecting } = useWallet();

  if (!isConnected || !account || !network) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num < 0.001) {
      return '< 0.001';
    }
    return num.toFixed(4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 这里可以添加复制成功的提示
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">账户信息</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshBalance}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            刷新余额
          </button>
          <button
            onClick={disconnectWallet}
            disabled={isConnecting}
            className="btn-secondary text-sm"
          >
            断开连接
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 网络信息 */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">网络</span>
          </div>
          <span className="text-sm text-gray-900">{network.name}</span>
        </div>

        {/* 账户地址 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">账户地址</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800">
              {formatAddress(account.address)}
            </code>
            <button
              onClick={() => copyToClipboard(account.address)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="复制完整地址"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 余额信息 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">余额</label>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl font-bold text-blue-900">
              {formatBalance(account.balance)}
            </span>
            <span className="text-sm font-medium text-blue-700">
              {network.nativeCurrency.symbol}
            </span>
          </div>
        </div>

        {/* 区块链浏览器链接 */}
        <div className="pt-2">
          <a
            href={`${network.blockExplorerUrl}/address/${account.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>在区块链浏览器中查看</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
