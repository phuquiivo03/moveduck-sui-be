import { SuiClient } from "@mysten/sui/dist/cjs/client";
export type ICoinResponse = {
    coinType: string;
    coinObjectId: string;
    version: string;
    digest: string;
    balance: string;
    previousTransaction: string;
  };
export async function getWalletBalances(client: SuiClient, address: string) {
    try {
      const balance = await client.getAllCoins({ owner: address });
      const validCoins = balance.data
        .map((coin: ICoinResponse) =>
          parseFloat(coin.balance) > 0 ? coin : null
        )
        .filter((coin) => coin !== null);
      const formatedCoins = await Promise.all(
        validCoins.map(async (coin) => {
          if (!coin) return null;
          const tokenInfo = await getTokenInfo(client, coin.coinType);
          if (!tokenInfo || !coin.balance) return null;
          return {
            symbol: tokenInfo.symbol,
            ...coin,
            balance: parseFloat(coin.balance) / 10 ** tokenInfo.decimals,
          };
        })
      );
  
      const mergeCoins = formatedCoins.reduce((acc, coin) => {
        if (coin) {
          const existingCoin = acc.find(
            (c: ICoinResponse) => c.coinType === coin?.coinType
          );
          if (existingCoin) {
            // @ts-ignore
            existingCoin.balance += coin?.balance;
          } else {
            // @ts-ignore
            acc.push(coin);
          }
        }
        return acc;
      }, []);
  
      return mergeCoins;
    } catch (error) {
      return null;
    }
  }

  export async function getTokenBalance(
    client: SuiClient,
    walletAddress: string,
    coinType: string
  ) {
    console.log(walletAddress, coinType);
    try {
      const balance = await client.getBalance({ owner: walletAddress, coinType });
      return balance.totalBalance;
    } catch (error) {
      return null;
    }
  }

  export async function getTokenInfo(client: SuiClient, coinType: string) {
    try {
      const metadata = await client.getCoinMetadata({ coinType });
      return metadata;
    } catch (error) {
      return null;
    }
  }


  export async function getCoinInfo(client: SuiClient, coinType: string) {
    const metadata = await client.getCoinMetadata({ coinType: coinType });
    // const decimals = metadata?.decimals || 9; // Default to 9 if not found
    return metadata;
  
  }


export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}