import React from 'react';
import WalletButton from '../components/WalletButton';
import NetworkSelector from '../components/NetworkSelector';
import AccountInfo from '../components/AccountInfo';
import SignMessage from '../components/SignMessage';
import { useWallet } from '../contexts/WalletContext';

const Home: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Web3 钱包应用
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            安全、便捷的以太坊钱包连接体验。支持MetaMask和Coinbase钱包，
            轻松管理您的数字资产。
          </p>
        </header>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          {/* 连接状态卡片 */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {isConnected ? '已连接' : '未连接'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {isConnected ? '钱包已成功连接' : '请连接您的钱包以开始使用'}
                </div>
              </div>
              <WalletButton />
            </div>
          </div>

          {/* 网络选择器 */}
          {isConnected && (
            <div className="card mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">网络设置</h3>
                  <p className="text-sm text-gray-600">
                    选择您要使用的以太坊网络
                  </p>
                </div>
                <NetworkSelector />
              </div>
            </div>
          )}

          {/* 账户信息 */}
          {isConnected && <AccountInfo />}

          {/* 签名消息 */}
          {isConnected && <SignMessage />}

          {/* 功能说明 */}
          {!isConnected && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">安全连接</h3>
                <p className="text-gray-600">
                  支持MetaMask和Coinbase钱包，确保您的资产安全
                </p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多网络支持</h3>
                <p className="text-gray-600">
                  支持以太坊主网和Sepolia测试网，满足不同需求
                </p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时余额</h3>
                <p className="text-gray-600">
                  实时显示账户余额，支持一键刷新
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
