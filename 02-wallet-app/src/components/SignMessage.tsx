import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

const SignMessage: React.FC = () => {
  const { signMessage, account } = useWallet();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);


  const handleSignMessage = async () => {
    if (!message) {
      setError('请输入要签名的消息');
      return;
    }

    setIsLoading(true);
    setError('');
    setSignature('');
    setVerificationResult(null);

    try {
      const sig = await signMessage(message);
      setSignature(sig);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || '签名失败');
      } else {
        setError('一个未知的错误发生');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleVerifySignature = () => {
    if (!account?.address || !message || !signature) {
      setVerificationResult('需要消息、签名和账户地址才能验证。');
      return;
    }
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() === account.address.toLowerCase()) {
        setVerificationResult('✅ 签名验证成功！');
      } else {
        setVerificationResult(`❌ 签名验证失败。签名地址 (${recoveredAddress}) 与当前账户地址不匹配。`);
      }
    } catch (error) {
      console.error('验证失败:', error);
      setVerificationResult('❌ 签名无效或格式不正确。');
    }
  };

  return (
    <div className="card mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">签名消息</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="message" className="text-sm font-medium text-gray-700">
            消息
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入要签名的消息..."
            className="input-field mt-1 h-24"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleSignMessage}
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isLoading ? '签名中...' : '签名'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {signature && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">签名结果</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-800 break-all">
                  {signature}
                </code>
                <button
                  onClick={() => copyToClipboard(signature)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="复制签名"
                >
                  {copySuccess ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleVerifySignature}
              className="btn-secondary w-full"
            >
              验证签名
            </button>

            {verificationResult && (
              <div className={`p-3 rounded-lg text-sm ${
                verificationResult.startsWith('✅')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {verificationResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignMessage;
