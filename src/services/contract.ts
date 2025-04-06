import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateRandomString, getCoinInfo, getWalletBalances } from './utils';
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import dotenv from 'dotenv';
import { AuthorizeUserRequest, ContractCreatePoolEvent, StakeNFTsRequest, StakeTokenRequest } from '../dto/contract';
import { CoinInfo, CreatePoolEvent } from '../type/contract';
import { LinkRepository, LinkRepositoryImpl } from '../repository/link';
import { Link } from '../type/link';
import poolModel from '../model/pool';
dotenv.config();
class ContractService {
    package: string;
    private client: SuiClient;
    private environment:'testnet' | 'mainnet';
    private linkRepository: LinkRepository

    constructor() {
        this.package = `${process.env.SUI_CONTRACT_PACKAGE}::${process.env.SUI_CONTRACT_MODULE}`;
        this.environment = 'testnet';
        this.client = new SuiClient({
            url: `https://fullnode.${this.environment}.sui.io`,
          });
          this.linkRepository = new LinkRepositoryImpl();
    }
    async createBounty(privateKey: string) {
      const key = decodeSuiPrivateKey(privateKey);
      const signer = Ed25519Keypair.fromSecretKey(key.secretKey);
      if (!signer)
        throw { code: 400, data: "Private key is invalid", status: false };
      // get token objects
    //   const coins = await getWalletBalances(this.client, signer.toSuiAddress());
        const tx = new Transaction()
        tx.moveCall({
            target: `${this.package}::create_pool`,
            arguments: [

            ]
        })

        const response = await this.client.signAndExecuteTransaction({
            signer: signer,
            transaction: tx,
        })

        console.log(response)

        const result = await this.client.waitForTransaction({
            digest: response.digest,
        })

        const txData = await this.client.getTransactionBlock({
            digest: result.digest,
            options: {
              showEvents: true,
              showEffects: true,
            },
          });

          const success = txData.effects?.status?.status === 'success';
            if (!success) {
            throw new Error('Transaction failed: ' + JSON.stringify(txData.effects?.status));
            }
             // Extract mint events
    const mintEvents = txData.events?.filter(event => {
        // Adjust this filter based on your specific event structure
        return event.type.includes('::CreatePoolEvent') 
      });
      
      console.log('Mint events:', mintEvents);
      
      // Process mint event data
      if (mintEvents && mintEvents.length > 0) {
        const mintedObject: CreatePoolEvent = mintEvents[0].parsedJson as CreatePoolEvent;
        console.log('Minted object:', mintedObject);
        poolModel.create({poolId: mintedObject.pool_id})
        return {
          data: mintedObject,
          transaction: result};
      } else {
        console.log('No mint events found');
        // return null;
      }
        return result;
    }


    async stakeToken(stakeTokenRequest: StakeTokenRequest) {
      const { privateKey, symbol, amount, poolId, numOfLinks } = stakeTokenRequest
      const key = decodeSuiPrivateKey(privateKey);
      const signer = Ed25519Keypair.fromSecretKey(key.secretKey);
      
      if (!signer)
        throw { code: 400, data: "Private key is invalid", status: false };
      
      // get owners token objects
      
      const ownedTokens = await getWalletBalances(this.client, signer.toSuiAddress());
      
      if(!ownedTokens) return null;
      console.log(ownedTokens)

      // find the target token
      const targetToken: CoinInfo | undefined = ownedTokens?.find((token: CoinInfo) => token.symbol === symbol);
      if(!targetToken) return {
        message: "Token not found",
      };
      
      const coinInfo = await getCoinInfo(this.client, (targetToken as CoinInfo).coinType);

      // convert to smallest units
      const amountInSmallestUnits = BigInt(amount * 10 ** (coinInfo?.decimals || 9));
      
      const coins = await this.client.getCoins({
        owner: signer.toSuiAddress(),
        coinType: (targetToken as CoinInfo).coinType,
      });
      
      if (coins.data.length === 0) {
        throw new Error(`No coins of type ${(targetToken as CoinInfo).coinType} found in wallet`);
      }
      
      // Find a coin with sufficient balance
      const coinWithSufficientBalance = coins.data.find(
        coin => BigInt(coin.balance) >= amountInSmallestUnits
      );
      
      if (!coinWithSufficientBalance) {
        throw {
          message: `Insufficient balance. Required: ${amountInSmallestUnits}`,
        };
      }

      const tx = new Transaction();
      
      // Set gas budget
      tx.setGasBudget(5000000);
      // call transaction to stake assets
      tx.moveCall({
            target: `${this.package}::stake_token`,
            arguments: [
                tx.object(poolId),
                coinWithBalance({ balance: amountInSmallestUnits, type: (targetToken as CoinInfo).coinType }),
            ],
            typeArguments: [
              // @ts-ignore
              targetToken.coinType,
            ]
        })


      try {
        const response = await this.client.signAndExecuteTransaction({
          signer: signer,
          transaction: tx,
        });
        
        const result = await this.client.waitForTransaction({
          digest: response.digest,
        });

        // transaction successfull -> create links
        const linkId = generateRandomString(6);
        const amountPerLink = Number(amountInSmallestUnits / BigInt(numOfLinks));
        const link :Link = {
          linkId,
          function: `${this.package}::claim_token`,
          params: [{
            index: 0,
            type: 'string',
            value: poolId
          }, {
            index: 1,
            type: 'number',
            value: amountPerLink
          }],
          typeArguments: []
        }
        const createdLink = await this.linkRepository.create(link);

        
        return createdLink;
      } catch (error) {
        console.error("Transaction error:", error);
        throw {
          code: 500,
          message: "Transaction failed",
          error: error || error
        };
      }
    }


    async authorizeUser(authorRequest: AuthorizeUserRequest) {
      const {privateKey, poolId, userAddress} = authorRequest;
      const key = decodeSuiPrivateKey(privateKey);
      const signer = Ed25519Keypair.fromSecretKey(key.secretKey);
      if (!signer)
        throw { code: 400, data: "Private key is invalid", status: false };
      // get token objects
    //   const coins = await getWalletBalances(this.client, signer.toSuiAddress());
        const tx = new Transaction()
        tx.moveCall({
            target: `${this.package}::add_authorized_claimer`,
            arguments: [
              tx.object(poolId),
              tx.pure.address(userAddress)
            ]
        })

        const response = await this.client.signAndExecuteTransaction({
            signer: signer,
            transaction: tx,
        })
        const result = await this.client.waitForTransaction({
          digest: response.digest,
        });
        return result;
    }

    async stakeNFTs(stakeRequest: StakeNFTsRequest) {
      try {
        const { privateKey, poolId, nfts } = stakeRequest;
        const key = decodeSuiPrivateKey(privateKey);
        const signer = Ed25519Keypair.fromSecretKey(key.secretKey);
        if (!signer)
          return { code: 400, data: "Private key is invalid", status: false };
        // get token objects
        const tx = new Transaction()
        nfts.forEach((nft, index) => {
          tx.moveCall({
            target: `${this.package}::stake_nft`,
            arguments: [
              tx.object(poolId),
              tx.object(nft.objectId)
            ],
            typeArguments: [
              nft.type,
            ]
          })
        })
  
        const response = await this.client.signAndExecuteTransaction({
            signer: signer,
            transaction: tx,
        })
        const result = await this.client.waitForTransaction({
          digest: response.digest,
        })

        // stake successfull -> create links
        const createdLinks =  Promise.all(stakeRequest.nfts.map(async (nft) => {
          const linkId = generateRandomString(6);
          const link :Link = {
            linkId,
            function: `${this.package}::claim_nft`,
            params: [
              {
                index: 0,
                type: 'string',
                value: poolId
              }, {
                index: 1,
                type: 'string',
                value: nft.objectId
              }
          ],
            typeArguments: [
              nft.type
            ]
          }
          const createdLink = await this.linkRepository.create(link);
          return createdLink;
        }));
  
        return createdLinks;  
      }catch(e) {
        throw {
          status: false,
          code: 400,
          message: (e as Error).message
        }
      }
    }

    async claim(linkId: string) {
      const link = await this.linkRepository.findOne({
        filter: {
          linkId
        }
      });

      if(!link) 
          throw "Link not found"
      
      return link;
    }

    async latestPoolId() {
      const pool = await poolModel.findOne({}).sort({createdAt: -1});
      return pool?.poolId;
    }
}


const contractService = new ContractService();
export default contractService;





