import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-casino-gold to-crypto-cyan rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">♠</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-casino-gold">Crypto Showdown Ace</h2>
            <p className="text-sm text-muted-foreground">Secure Poker. Encrypted Hands.</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/features" className="text-foreground hover:text-casino-gold transition-colors">
            Features
          </a>
          <a href="/how-it-works" className="text-foreground hover:text-casino-gold transition-colors">
            How It Works
          </a>
          <a href="/security" className="text-foreground hover:text-casino-gold transition-colors">
            Security
          </a>
        </nav>

        <ConnectButton 
          chainStatus="icon"
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
    </header>
  );
};

export default Header;