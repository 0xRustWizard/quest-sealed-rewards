import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Shield, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "⚔️ Wallet Disconnected",
      description: "Your quest progress has been saved. Return when ready.",
    });
  };

  return (
    <Card className="p-6 bg-gradient-parchment border-2 border-bronze shadow-ancient">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-gold rounded-full shadow-treasure">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-adventure font-semibold text-lg text-foreground">
              Adventurer's Vault
            </h3>
            <p className="text-sm text-muted-foreground font-serif">
              {isConnected ? "Secured & Ready" : "Connect to begin your quest"}
            </p>
          </div>
        </div>

        {!isConnected ? (
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button 
                          onClick={openConnectModal}
                          className="bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground font-adventure font-semibold px-6 py-2 shadow-treasure"
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button 
                          onClick={openChainModal}
                          className="bg-red-500 hover:bg-red-600 text-white font-adventure font-semibold px-6 py-2"
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-quest">
                            <Check className="w-4 h-4" />
                            <span className="font-adventure font-medium">Connected</span>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">
                            {account.displayName}
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={handleDisconnect}
                          className="border-bronze text-bronze hover:bg-bronze/10"
                        >
                          Disconnect
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 text-quest">
                <Check className="w-4 h-4" />
                <span className="font-adventure font-medium">Connected</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={handleDisconnect}
              className="border-bronze text-bronze hover:bg-bronze/10"
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WalletConnection;