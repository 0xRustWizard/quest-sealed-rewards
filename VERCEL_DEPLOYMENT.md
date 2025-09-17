# Vercel Deployment Guide for Quest Sealed Rewards

This guide provides step-by-step instructions for deploying the Quest Sealed Rewards application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub account with access to the repository
- Environment variables ready

## Step 1: Connect GitHub Repository

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project" on the dashboard
   - Select "Import Git Repository"
   - Choose `0xRustWizard/quest-sealed-rewards` from the list
   - Click "Import"

## Step 2: Configure Build Settings

1. **Framework Preset**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Root Directory**
   - Leave as default (root of repository)

## Step 3: Environment Variables Configuration

Add the following environment variables in Vercel dashboard:

### Required Environment Variables

```bash
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475

# Infura Configuration
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

### How to Add Environment Variables

1. In your Vercel project dashboard
2. Go to "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add each variable:
   - **Name**: `NEXT_PUBLIC_CHAIN_ID`
   - **Value**: `11155111`
   - **Environment**: Production, Preview, Development (select all)
5. Repeat for all variables above
6. Click "Save"

## Step 4: Deploy

1. **Initial Deployment**
   - Click "Deploy" button
   - Wait for build to complete (usually 2-3 minutes)
   - Vercel will automatically assign a domain like `quest-sealed-rewards-xxx.vercel.app`

2. **Verify Deployment**
   - Click on the generated URL to open your deployed app
   - Test wallet connection functionality
   - Verify all features work correctly

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to "Domains" tab in project settings
   - Click "Add Domain"
   - Enter your custom domain (e.g., `questsealedrewards.com`)
   - Follow DNS configuration instructions

2. **DNS Configuration**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record pointing to Vercel's IP addresses
   - Wait for DNS propagation (up to 24 hours)

## Step 6: Production Optimizations

### Performance Optimizations

1. **Enable Analytics**
   - Go to "Analytics" tab
   - Enable Web Analytics for performance monitoring

2. **Configure Caching**
   - Static assets are automatically cached
   - API routes can be configured for caching if needed

### Security Settings

1. **Headers Configuration**
   - Add security headers in `vercel.json` if needed
   - Configure CORS for API endpoints

2. **Environment Variables Security**
   - Never commit sensitive keys to repository
   - Use Vercel's environment variables for all secrets

## Step 7: Monitoring and Maintenance

### Monitoring

1. **Deployment Status**
   - Monitor deployments in Vercel dashboard
   - Set up notifications for failed deployments

2. **Performance Monitoring**
   - Use Vercel Analytics for performance insights
   - Monitor Core Web Vitals

### Updates

1. **Automatic Deployments**
   - Every push to main branch triggers automatic deployment
   - Preview deployments for pull requests

2. **Manual Deployments**
   - Use "Redeploy" button for manual deployments
   - Rollback to previous versions if needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Ensure environment variables are set correctly

2. **Function Runtime Errors**
   - Error: "Function Runtimes must have a valid version"
   - **Solution**: Remove the `functions` section from `vercel.json` for static sites
   - This project is a static Vite app and doesn't need serverless functions

3. **Environment Variables Not Working**
   - Verify variable names start with `NEXT_PUBLIC_`
   - Check that variables are set for correct environments
   - Redeploy after adding new variables

4. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure chain ID matches Sepolia testnet

### Build Logs

- Access build logs in Vercel dashboard
- Check for TypeScript errors
- Verify all imports are correct

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Wallet connection works on all supported wallets
- [ ] Smart contract addresses are configured
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics are enabled
- [ ] Error monitoring is set up
- [ ] Performance is optimized
- [ ] Security headers are configured

## Support

For deployment issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs for specific errors
3. Verify environment variables configuration
4. Test locally before deploying

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/installation)
- [Wagmi Documentation](https://wagmi.sh/)

---

**Note**: This deployment guide assumes you're using the default Vercel configuration. For custom configurations, refer to the Vercel documentation for advanced setup options.
