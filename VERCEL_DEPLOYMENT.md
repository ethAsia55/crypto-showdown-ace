# 🚀 Vercel Deployment Guide

> **Deploy Crypto Showdown Ace to Vercel in minutes**

This comprehensive guide walks you through deploying your FHE-powered poker platform to Vercel with zero configuration.

## 📋 Prerequisites

- ✅ Vercel account (free tier available)
- ✅ GitHub repository access  
- ✅ Environment variables ready
- ✅ Smart contracts deployed

## 🎯 Quick Deployment

### Step 1: Repository Setup

Ensure your code is committed and pushed:

```bash
# Commit your changes
git add .
git commit -m "feat: Add FHE encryption and wallet integration"
git push origin main
```

### Step 2: Connect to Vercel

1. **Visit** [vercel.com](https://vercel.com)
2. **Sign in** with your GitHub account
3. **Click** "New Project"
4. **Import** your repository: `ethAsia55/crypto-showdown-ace`

### Step 3: Build Configuration

Configure your build settings:

| Setting | Value |
|---------|-------|
| **Framework** | Vite |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 4: Environment Variables

Add these environment variables in the Vercel dashboard:

#### 🔧 Required Variables

```env
# Blockchain Configuration
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
```

#### 🔧 Optional Variables

```env
# Additional RPC Endpoints
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
VITE_RPC_URL=https://1rpc.io/sepolia

# Contract Addresses (after deployment)
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_ORACLE_ADDRESS=YOUR_ORACLE_ADDRESS
```

### 5. Advanced Configuration

Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 6. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at: `https://your-project-name.vercel.app`

### 7. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable SSL certificate

## Post-Deployment Configuration

### 1. Update Contract Addresses

After deploying your smart contracts:
1. Get the deployed contract address
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel environment variables
3. Redeploy the application

### 2. Configure WalletConnect

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Update `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` with your project ID

### 3. Test the Application

1. Visit your deployed URL
2. Connect a wallet (MetaMask, Rainbow, etc.)
3. Test the poker table functionality
4. Verify contract interactions work correctly

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding new variables

3. **Wallet Connection Issues**:
   - Verify WalletConnect project ID
   - Check RPC URL is accessible
   - Ensure chain ID is correct

4. **Contract Interaction Issues**:
   - Verify contract is deployed
   - Check contract address is correct
   - Ensure user has sufficient ETH for gas

### Performance Optimization:

1. **Enable Vercel Analytics**:
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Configure Edge Functions** (if needed):
   - Use Vercel Edge Runtime for better performance
   - Optimize for global distribution

3. **Caching**:
   - Configure appropriate cache headers
   - Use Vercel's CDN for static assets

## Monitoring and Maintenance

### 1. Set Up Monitoring

- Enable Vercel Analytics
- Set up error tracking (Sentry, LogRocket)
- Monitor wallet connection success rates

### 2. Regular Updates

- Keep dependencies updated
- Monitor for security vulnerabilities
- Update smart contract addresses as needed

### 3. Backup Strategy

- Keep GitHub repository updated
- Export environment variables
- Document deployment process

## Security Considerations

1. **Environment Variables**:
   - Never commit sensitive keys to repository
   - Use Vercel's secure environment variable storage
   - Rotate keys regularly

2. **Smart Contract Security**:
   - Audit contracts before mainnet deployment
   - Use multi-signature wallets for contract upgrades
   - Monitor for suspicious activity

3. **Application Security**:
   - Enable HTTPS only
   - Configure proper CORS settings
   - Implement rate limiting

## Support

For deployment issues:
- Check Vercel documentation
- Review build logs in Vercel dashboard
- Contact Vercel support for platform issues

For application issues:
- Check browser console for errors
- Verify wallet connection
- Test on different networks

## Next Steps

After successful deployment:
1. Test all functionality thoroughly
2. Set up monitoring and alerts
3. Plan for mainnet deployment
4. Consider additional security measures
5. Prepare user documentation

---

**Note**: This deployment guide assumes you have already deployed your smart contracts to the Sepolia testnet. Make sure to update the contract addresses in your environment variables after deployment.
