import Header from "@/components/Header";
import PokerTable from "@/components/PokerTable";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Users, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-casino-green/10 to-crypto-cyan/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-casino-gold to-crypto-cyan bg-clip-text text-transparent">
            Crypto Showdown Ace
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience poker like never before with FHE encryption. Your cards remain completely private until showdown.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-crypto-cyan/20 rounded-full border border-crypto-cyan/30">
              <Lock className="w-5 h-5 text-crypto-cyan" />
              <span className="text-crypto-cyan font-semibold">FHE Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-casino-gold/20 rounded-full border border-casino-gold/30">
              <Shield className="w-5 h-5 text-casino-gold" />
              <span className="text-casino-gold font-semibold">Zero-Knowledge</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-semibold">Decentralized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose <span className="text-crypto-cyan">Crypto Showdown Ace</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary poker platform with military-grade encryption and complete privacy protection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="felt-texture border-border/50 hover:border-crypto-cyan/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Lock className="w-16 h-16 text-crypto-cyan mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">FHE Encryption</h3>
                <p className="text-muted-foreground">
                  Your poker hands are encrypted using Zama's FHE technology. No one can see your cards until the final reveal.
                </p>
              </CardContent>
            </Card>

            <Card className="felt-texture border-border/50 hover:border-casino-gold/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Shield className="w-16 h-16 text-casino-gold mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Zero-Knowledge Proofs</h3>
                <p className="text-muted-foreground">
                  Game integrity is verified without revealing any private data. Fair play is guaranteed by cryptography.
                </p>
              </CardContent>
            </Card>

            <Card className="felt-texture border-border/50 hover:border-green-500/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Decentralized Gaming</h3>
                <p className="text-muted-foreground">
                  No central authority controls the games. All logic is on-chain and transparent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Poker Table Section */}
      <PokerTable />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-casino-green/5 to-crypto-cyan/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-casino-gold mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-casino-gold mb-2">$2.4M+</h3>
              <p className="text-muted-foreground">Total Volume</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-crypto-cyan mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-crypto-cyan mb-2">15K+</h3>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-green-500 mb-2">100%</h3>
              <p className="text-muted-foreground">Secure Games</p>
            </div>
            <div className="text-center">
              <Lock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-purple-500 mb-2">FHE</h3>
              <p className="text-muted-foreground">Encrypted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-casino-gold to-crypto-cyan rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">♠</span>
            </div>
            <h3 className="text-xl font-bold text-casino-gold">Crypto Showdown Ace</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            The future of private poker gaming with FHE encryption
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-casino-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-casino-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-casino-gold transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
