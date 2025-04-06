export interface StakeNFTRequest {
    privateKey: string;
    poolId: string;
    nftId: string;
}


export interface CoinInfo {
    symbol: string;
    coinType: string;
    coinObjectId: string;
    version: string;
    digest: string;
    balance: number;
    previousTransaction: string;
}

export interface CreatePoolEvent {
    pool_id: string;
    timestamp: string;
}