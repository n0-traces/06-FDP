import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { createWallet, connectMetaMask } from "~web3/wallet";
import { transferERC20 } from "~web3/erc20";
import { monitorTransfers } from "~web3/events";
import { getAmountsOut, swapTokens } from "~web3/dex";

interface Message {
  type: "success" | "error" | "info";
  text: string;
}

const App = () => {
  const [generatedWallet, setGeneratedWallet] = useState(() => createWallet());
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);

  const [erc20Form, setErc20Form] = useState({
    contractAddress: "",
    to: "",
    amount: "0.1",
    decimals: 18
  });

  const [monitoring, setMonitoring] = useState(false);
  const [monitorAddress, setMonitorAddress] = useState("");
  const [monitorLogs, setMonitorLogs] = useState<string[]>([]);
  const [monitorStop, setMonitorStop] = useState<(() => void) | null>(null);

  const [swapForm, setSwapForm] = useState({
    router: "",
    amountIn: "1",
    path: "",
    minOut: "",
    estimated: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const provider = useMemo(() => {
    if (!signer) return null;
    return signer.provider as ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  }, [signer]);

  useEffect(() => {
    if (!signer) {
      setCurrentAccount("");
      return;
    }

    signer.getAddress().then(setCurrentAccount).catch(() => setCurrentAccount(""));
  }, [signer]);

  const showMessage = (data: Message) => {
    setMessage(data);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleConnect = async () => {
    try {
      const signerResult = await connectMetaMask();
      setSigner(signerResult);
      showMessage({ type: "success", text: "MetaMask 连接成功" });
    } catch (error: unknown) {
      showMessage({ type: "error", text: (error as Error).message });
    }
  };

  const handleTransfer = async () => {
    try {
      setIsLoading(true);
      await transferERC20({
        contractAddress: erc20Form.contractAddress,
        to: erc20Form.to,
        amount: erc20Form.amount,
        decimals: erc20Form.decimals,
        provider: provider ?? undefined
      });
      showMessage({ type: "success", text: "交易已提交，等待确认" });
    } catch (error: unknown) {
      showMessage({ type: "error", text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMonitor = () => {
    if (!monitorAddress) {
      showMessage({ type: "error", text: "请输入要监听的合约地址" });
      return;
    }

    if (monitoring) {
      monitorStop?.();
      setMonitorStop(null);
      setMonitoring(false);
      setMonitorLogs([]);
      return;
    }

    const stop = monitorTransfers({
      contractAddress: monitorAddress,
      onTransfer: (from, to, value) =>
        setMonitorLogs((prev) => [`${from} -> ${to} : ${ethers.formatUnits(value, 18)} 代币`, ...prev].slice(0, 20))
    });

    setMonitorStop(() => stop);
    setMonitoring(true);
    showMessage({ type: "info", text: "开始监听 Transfer 事件" });
  };

  useEffect(() => {
    return () => monitorStop?.();
  }, [monitorStop]);

  const handleEstimate = async () => {
    try {
      setIsLoading(true);
      const path = swapForm.path.split(",").map((item) => item.trim()).filter(Boolean);
      if (path.length < 2) {
        throw new Error("路径至少包含两个地址");
      }

      const result = await getAmountsOut({
        routerAddress: swapForm.router,
        path,
        amountIn: swapForm.amountIn,
        provider: provider ?? undefined
      });

      setSwapForm((prev) => ({ ...prev, estimated: result[result.length - 1] }));
      showMessage({ type: "success", text: "已获取预估兑换数量" });
    } catch (error: unknown) {
      showMessage({ type: "error", text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    try {
      setIsLoading(true);
      const path = swapForm.path.split(",").map((item) => item.trim()).filter(Boolean);
      await swapTokens({
        routerAddress: swapForm.router,
        path,
        amountIn: swapForm.amountIn,
        amountOutMin: swapForm.minOut || undefined,
        provider: provider ?? undefined
      });
      showMessage({ type: "success", text: "兑换交易已提交" });
    } catch (error: unknown) {
      showMessage({ type: "error", text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold">Web3 学习 DApp</h1>
            <p className="text-sm text-slate-400">钱包交互 · 代币转账 · 事件监听 · DEX 兑换</p>
          </div>
          <button
            onClick={handleConnect}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            {currentAccount ? `已连接: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "连接 MetaMask"}
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : message.type === "error"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                  : "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="mb-4 text-lg font-semibold">随机钱包生成</h2>
            <p className="mb-4 text-sm text-slate-400">仅用于学习演示，请勿在生产环境使用这些密钥。</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500">地址</p>
                <p className="break-all font-mono text-xs text-slate-200">{generatedWallet.address}</p>
              </div>
              <div>
                <p className="text-slate-500">私钥</p>
                <p className="break-all font-mono text-xs text-rose-300">{generatedWallet.privateKey}</p>
              </div>
              {generatedWallet.mnemonic && (
                <div>
                  <p className="text-slate-500">助记词</p>
                  <p className="break-all font-mono text-xs text-orange-300">{generatedWallet.mnemonic}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setGeneratedWallet(createWallet())}
              className="mt-6 w-full rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/20"
            >
              重新生成
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="mb-4 text-lg font-semibold">ERC20 代币转账</h2>
            <div className="space-y-4">
              <label className="block text-sm">
                <span className="text-slate-400">合约地址</span>
                <input
                  value={erc20Form.contractAddress}
                  onChange={(event) => setErc20Form((prev) => ({ ...prev, contractAddress: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="0x..."
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">目标地址</span>
                <input
                  value={erc20Form.to}
                  onChange={(event) => setErc20Form((prev) => ({ ...prev, to: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="0x..."
                />
              </label>
              <div className="flex gap-4">
                <label className="block w-1/2 text-sm">
                  <span className="text-slate-400">数量</span>
                  <input
                    value={erc20Form.amount}
                    onChange={(event) => setErc20Form((prev) => ({ ...prev, amount: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </label>
                <label className="block w-1/2 text-sm">
                  <span className="text-slate-400">小数位</span>
                  <input
                    type="number"
                    value={erc20Form.decimals}
                    onChange={(event) =>
                      setErc20Form((prev) => ({
                        ...prev,
                        decimals: Number.parseInt(event.target.value || "18", 10)
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </label>
              </div>
              <button
                disabled={isLoading}
                onClick={handleTransfer}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/50"
              >
                发起转账
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="mb-4 text-lg font-semibold">链上事件监听</h2>
            <div className="space-y-4 text-sm">
              <label className="block">
                <span className="text-slate-400">监听的合约地址</span>
                <input
                  value={monitorAddress}
                  onChange={(event) => setMonitorAddress(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="0x..."
                />
              </label>
              <button
                onClick={toggleMonitor}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  monitoring
                    ? "bg-rose-500 text-slate-950 hover:bg-rose-400"
                    : "bg-indigo-500 text-slate-100 hover:bg-indigo-400"
                }`}
              >
                {monitoring ? "停止监听" : "开始监听 Transfer"}
              </button>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/80 p-3 font-mono text-xs text-slate-300">
                {monitorLogs.length === 0 ? (
                  <p className="text-slate-500">暂无事件日志</p>
                ) : (
                  monitorLogs.map((log, index) => (
                    <p key={`${log}-${index}`} className="mb-2">
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="mb-4 text-lg font-semibold">DEX 代币兑换</h2>
            <div className="space-y-4 text-sm">
              <label className="block">
                <span className="text-slate-400">Router 地址（例如 Uniswap V2）</span>
                <input
                  value={swapForm.router}
                  onChange={(event) => setSwapForm((prev) => ({ ...prev, router: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="0x..."
                />
              </label>
              <label className="block">
                <span className="text-slate-400">路径（使用逗号分隔）</span>
                <input
                  value={swapForm.path}
                  onChange={(event) => setSwapForm((prev) => ({ ...prev, path: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="TokenIn,TokenOut"
                />
              </label>
              <div className="flex gap-4">
                <label className="block w-1/2">
                  <span className="text-slate-400">兑换数量</span>
                  <input
                    value={swapForm.amountIn}
                    onChange={(event) => setSwapForm((prev) => ({ ...prev, amountIn: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </label>
                <label className="block w-1/2">
                  <span className="text-slate-400">最小输出</span>
                  <input
                    value={swapForm.minOut}
                    onChange={(event) => setSwapForm((prev) => ({ ...prev, minOut: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={isLoading}
                  onClick={handleEstimate}
                  className="flex-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 hover:bg-indigo-500/20 disabled:cursor-not-allowed"
                >
                  预估兑换结果
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleSwap}
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-500/50"
                >
                  执行兑换
                </button>
              </div>
              {swapForm.estimated && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  预估输出：{swapForm.estimated}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>🚀 学习路线：环境搭建 → 钱包交互 → 合约开发 → 事件监听 → DeFi 集成 → 安全审计</p>
          <p>基于 ethers.js + Hardhat + React 构建</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

