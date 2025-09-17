# Quest Sealed Rewards

A decentralized quest platform with encrypted reward distribution using Fully Homomorphic Encryption (FHE) technology.

## Features

- **Encrypted Quest System**: Participate in quests with rewards sealed using FHE encryption
- **Fair Reward Distribution**: Rewards are only revealed when all participants complete their challenges
- **Web3 Integration**: Connect with popular wallets like Rainbow, MetaMask, and more
- **Real-time Progress Tracking**: Monitor quest completion and participant progress
- **Secure Smart Contracts**: Built on Sepolia testnet with FHE-enabled contracts

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Web3**: RainbowKit, Wagmi, Viem
- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption**: Zama FHE (Fully Homomorphic Encryption)
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/0xRustWizard/quest-sealed-rewards.git

# Navigate to the project directory
cd quest-sealed-rewards

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

## How It Works

1. **Quest Creation**: Organizers create quests with encrypted reward pools
2. **Participant Registration**: Users connect their wallets and join quests
3. **Progress Tracking**: Real-time monitoring of quest completion
4. **Reward Unlocking**: FHE-encrypted rewards are revealed when all participants complete the quest
5. **Fair Distribution**: Rewards are distributed based on participation and completion

## Smart Contracts

The platform uses FHE-enabled smart contracts deployed on Sepolia testnet:

- **QuestSealedRewards.sol**: Main contract managing quests and encrypted rewards
- **FHE Integration**: Core data encrypted using Zama's FHE technology
- **Reward Distribution**: Automated and fair reward distribution system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced quest types
- [ ] Reputation system
- [ ] Mobile app
- [ ] Governance token integration