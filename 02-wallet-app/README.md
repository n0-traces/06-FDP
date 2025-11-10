# Web3 钱包应用

一个基于 React + TypeScript + Vite + TailwindCSS 构建的现代化 Web3 钱包连接应用。

## 功能特性

- 🔗 **钱包连接**: 支持 MetaMask 和 Coinbase 钱包
- 🌐 **多网络支持**: 支持以太坊主网和 Sepolia 测试网
- 💰 **余额显示**: 实时显示账户余额，支持一键刷新
- 🎨 **现代UI**: 基于 TailwindCSS 的美观界面设计
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🔒 **安全可靠**: 使用 ethers.js 进行安全的区块链交互

## 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **TailwindCSS 3.4.17** - 样式框架
- **React Router** - 路由管理
- **ethers.js** - 以太坊交互库

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── WalletButton.tsx    # 钱包连接按钮
│   ├── WalletModal.tsx     # 钱包选择弹窗
│   ├── NetworkSelector.tsx # 网络选择器
│   └── AccountInfo.tsx     # 账户信息显示
├── contexts/           # React 上下文
│   └── WalletContext.tsx   # 钱包状态管理
├── pages/              # 页面组件
│   └── Home.tsx            # 主页面
├── types/              # TypeScript 类型定义
│   └── wallet.ts           # 钱包相关类型
├── App.tsx             # 应用根组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 使用说明

1. **连接钱包**: 点击"连接钱包"按钮，选择 MetaMask 或 Coinbase 钱包
2. **选择网络**: 连接后可以选择以太坊主网或 Sepolia 测试网
3. **查看信息**: 查看账户地址、余额等详细信息
4. **刷新余额**: 点击刷新按钮更新最新余额

## 注意事项

- 使用前请确保已安装 MetaMask 或 Coinbase 钱包浏览器扩展
- 测试时建议使用 Sepolia 测试网，避免在主网进行测试交易
- 请妥善保管您的私钥和助记词，不要在不安全的环境中使用

## 开发说明

### 添加新网络

在 `src/types/wallet.ts` 中的 `SUPPORTED_NETWORKS` 对象中添加新网络配置：

```typescript
const SUPPORTED_NETWORKS: Record<number, Network> = {
  // 现有网络...
  137: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};
```

### 自定义样式

项目使用 TailwindCSS 进行样式管理，可以在 `tailwind.config.js` 中自定义主题配置。

## 许可证

MIT License