import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get environment variables with fallbacks
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990';
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475';

export const config = getDefaultConfig({
  appName: 'Quest Sealed Rewards',
  projectId: walletConnectProjectId,
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export const supportedChains = [sepolia];
export const defaultChain = sepolia;
