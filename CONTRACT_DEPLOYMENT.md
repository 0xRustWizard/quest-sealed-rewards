# Smart Contract Deployment Guide

This guide explains how to deploy the QuestSealedRewards smart contract to Sepolia testnet.

## Prerequisites

- Node.js 18+ installed
- Sepolia ETH for gas fees (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- Private key with Sepolia ETH
- Infura or Alchemy account for RPC endpoint

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Setup

Create a `.env` file in the root directory:

```env
# Private key of the account that will deploy the contract
PRIVATE_KEY=your_private_key_here

# RPC URL for Sepolia testnet
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/your_infura_key

# Optional: Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ Security Warning**: Never commit your private key to version control. Add `.env` to `.gitignore`.

## Step 3: Compile Contracts

```bash
npm run compile
```

This will compile the QuestSealedRewards contract and generate artifacts in the `artifacts` directory.

## Step 4: Deploy to Sepolia

```bash
npm run deploy
```

This will:
1. Deploy the QuestSealedRewards contract to Sepolia
2. Save deployment information to `deployment-info.json`
3. Display the contract address

## Step 5: Verify Contract (Optional)

If you have an Etherscan API key, you can verify the contract:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <VERIFIER_ADDRESS>
```

Replace:
- `<CONTRACT_ADDRESS>` with the deployed contract address
- `<VERIFIER_ADDRESS>` with the verifier address used in deployment

## Step 6: Update Frontend Configuration

After deployment, update your frontend configuration:

1. **Update Contract Address**
   - Copy the contract address from `deployment-info.json`
   - Update the contract address in your frontend code

2. **Update ABI**
   - Copy the ABI from `artifacts/contracts/QuestSealedRewards.sol/QuestSealedRewards.json`
   - Update the ABI in your frontend code

## Contract Architecture

### QuestSealedRewards Contract

The main contract includes:

- **Quest Management**: Create, join, and complete quests
- **FHE Integration**: Encrypted reward pools and participant data
- **Reward Distribution**: Fair distribution when all participants complete
- **Reputation System**: Track participant and organizer reputation

### Key Functions

1. **createQuest()**: Create a new quest with encrypted reward pool
2. **joinQuest()**: Join a quest with encrypted contribution
3. **completeQuest()**: Mark quest as completed
4. **revealRewards()**: Reveal encrypted rewards
5. **claimReward()**: Claim individual rewards

### FHE Data Types

- `euint32`: Encrypted 32-bit unsigned integer
- `externalEuint32`: External encrypted data with proof
- `ebool`: Encrypted boolean

## Testing the Contract

### Local Testing

```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network
npm run deploy:local
```

### Testnet Testing

1. **Get Test ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH for your address

2. **Test Contract Functions**
   - Use Remix IDE or custom scripts
   - Test quest creation and participation
   - Verify FHE operations work correctly

## Gas Optimization

The contract is optimized for gas efficiency:

- Uses packed structs where possible
- Implements efficient storage patterns
- Minimizes external calls

## Security Considerations

1. **Access Control**
   - Only quest organizers can finish quests
   - Only verifiers can update reputation
   - Participants can only join once per quest

2. **FHE Security**
   - All sensitive data is encrypted
   - External proofs validate encrypted inputs
   - No plaintext data exposure

3. **Reentrancy Protection**
   - Uses checks-effects-interactions pattern
   - No external calls in state-changing functions

## Monitoring and Maintenance

### Contract Monitoring

1. **Event Logs**
   - Monitor quest creation events
   - Track participant joins and completions
   - Watch for reward claims

2. **State Changes**
   - Monitor quest status changes
   - Track reward pool updates
   - Watch reputation updates

### Upgrades

The contract is not upgradeable by design for security. For updates:

1. Deploy new contract version
2. Migrate data if necessary
3. Update frontend configuration
4. Notify users of migration

## Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check private key has sufficient ETH
   - Verify RPC URL is correct
   - Ensure network is accessible

2. **Compilation Errors**
   - Check Solidity version compatibility
   - Verify FHE imports are correct
   - Ensure all dependencies are installed

3. **Transaction Failures**
   - Check gas limits
   - Verify function parameters
   - Ensure contract state is valid

### Debug Commands

```bash
# Check network connection
npx hardhat console --network sepolia

# Get contract instance
const contract = await ethers.getContractAt("QuestSealedRewards", "CONTRACT_ADDRESS");

# Call view functions
await contract.getQuestInfo(0);
```

## Production Deployment

For mainnet deployment:

1. **Security Audit**
   - Conduct thorough security audit
   - Test all edge cases
   - Verify FHE implementation

2. **Gas Optimization**
   - Optimize for mainnet gas costs
   - Test with realistic data sizes
   - Monitor gas usage patterns

3. **Monitoring Setup**
   - Set up event monitoring
   - Configure alerts for critical events
   - Monitor contract health

## Support

For deployment issues:

1. Check Hardhat documentation
2. Review contract compilation errors
3. Verify network connectivity
4. Check gas and balance requirements

---

**Note**: This contract uses experimental FHE technology. Ensure you understand the implications before deploying to mainnet.
