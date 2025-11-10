import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';
import type { WalletContextType, WalletAccount, Network } from '../types/wallet';
import { SUPPORTED_NETWORKS } from '../types/wallet';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // 检查是否已连接钱包
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            const networkInfo = await provider.getNetwork();
            
            setAccount({
              address,
              balance: ethers.formatEther(balance),
            });
            
            const currentNetwork = SUPPORTED_NETWORKS[Number(networkInfo.chainId)];
            if (currentNetwork) {
              setNetwork(currentNetwork);
            }
            
            setIsConnected(true);
          }
        } catch (error) {
          console.error('检查钱包连接失败:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // 更新账户信息的通用函数
  const updateAccountInfo = async (address: string) => {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const networkInfo = await provider.getNetwork();
      
      setAccount({
        address,
        balance: ethers.formatEther(balance),
      });
      
      const currentNetwork = SUPPORTED_NETWORKS[Number(networkInfo.chainId)];
      if (currentNetwork) {
        setNetwork(currentNetwork);
      } else {
        // 如果当前网络不在支持列表中，设置为未知网络
        setNetwork({
          chainId: Number(networkInfo.chainId),
          name: `Unknown Network (${networkInfo.chainId})`,
          rpcUrl: '',
          blockExplorerUrl: '',
          nativeCurrency: {
            name: 'Unknown',
            symbol: 'UNK',
            decimals: 18,
          },
        });
      }
    } catch (error) {
      console.error('更新账户信息失败:', error);
    }
  };

  // 监听账户变化
  useEffect(() => {
    if (!window.ethereum) return;

    const refreshBalance = async () => {
      if (!account || !window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(account.address);
        setAccount(prev => prev ? {
          ...prev,
          balance: ethers.formatEther(balance),
        } : null);
      } catch (error) {
        console.error('刷新余额失败:', error);
      }
    };

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log('账户变化:', accounts);
      
      if (accounts.length === 0) {
        // 用户断开连接
        disconnectWallet();
      } else {
        // 用户切换账户
        const newAddress = accounts[0];
        if (account?.address !== newAddress) {
          await updateAccountInfo(newAddress);
        }
      }
    };

    const handleChainChanged = async (chainId: string) => {
      console.log('链ID变化:', chainId);
      if (!window.ethereum) return;
      
      // 重新获取网络信息
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const networkInfo = await provider.getNetwork();
        const currentNetwork = SUPPORTED_NETWORKS[Number(networkInfo.chainId)];
        
        if (currentNetwork) {
          setNetwork(currentNetwork);
        } else {
          setNetwork({
            chainId: Number(networkInfo.chainId),
            name: `Unknown Network (${networkInfo.chainId})`,
            rpcUrl: '',
            blockExplorerUrl: '',
            nativeCurrency: {
              name: 'Unknown',
              symbol: 'UNK',
              decimals: 18,
            },
          });
        }
        
        // 如果已连接，刷新余额
        if (account) {
          await refreshBalance();
        }
      } catch (error) {
        console.error('处理链变化失败:', error);
      }
    };

    const handleConnect = (connectInfo: { chainId: string }) => {
      console.log('钱包连接:', connectInfo);
    };

    const handleDisconnect = (error: unknown) => {
      console.log('钱包断开连接:', error);
      disconnectWallet();
    };

    // 添加事件监听器
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('connect', handleConnect);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      // 清理事件监听器
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [account]); // 依赖账户，确保在账户变化时重新绑定

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask或Coinbase钱包');
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        await updateAccountInfo(address);
        
        // 检查当前网络是否支持
        const networkInfo = await provider.getNetwork();
        const currentNetwork = SUPPORTED_NETWORKS[Number(networkInfo.chainId)];
        
        if (!currentNetwork) {
          // 如果当前网络不在支持列表中，提示用户切换
          console.warn('当前网络不在支持列表中，建议切换到支持的网络');
        }
        
        setIsConnected(true);
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetwork(null);
    setIsConnected(false);
  };

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask或Coinbase钱包');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      
      const network = SUPPORTED_NETWORKS[chainId];
      if (network) {
        setNetwork(network);
      }
    } catch (error: unknown) {
      // 如果网络不存在，尝试添加网络
      if ((error as { code?: number }).code === 4902) {
        const network = SUPPORTED_NETWORKS[chainId];
        if (network) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorerUrl],
                nativeCurrency: network.nativeCurrency,
              }],
            });
            setNetwork(network);
          } catch (addError) {
            console.error('添加网络失败:', addError);
            throw addError;
          }
        }
      } else {
        console.error('切换网络失败:', error);
        throw error;
      }
    }
  };

  const refreshBalance = async () => {
    if (!account || !window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account.address);
      setAccount(prev => prev ? {
        ...prev,
        balance: ethers.formatEther(balance),
      } : null);
    } catch (error) {
      console.error('刷新余额失败:', error);
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask或Coinbase钱包');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('签名失败:', error);
      throw error;
    }
  };

  const value: WalletContextType = {
    account,
    network,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    signMessage,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet必须在WalletProvider内部使用');
  }
  return context;
};

// 扩展Window接口以支持ethereum
// 定义一个符合EIP-1193标准的Provider接口
interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on<T>(event: string, listener: (...args: T[]) => void): this;
  removeListener<T>(event: string, listener: (...args: T[]) => void): this;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
