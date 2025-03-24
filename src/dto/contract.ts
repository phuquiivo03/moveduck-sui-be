export type ContractCreatePoolEvent = {
    id: {
        txDigest: string;
        eventSeq: string;
    };
    packageId: string;
    transactionModule: string;
    sender: string;
    type: string;
    parsedJson: {
        pool_id: string;
        timestamp: string;
    };
    bcsEncoding: string;
    bcs: string;
};

export type StakeTokenRequest = {
    poolId: string,
    amount: number,
    symbol: string,
    numOfLinks: number,
    privateKey: string
}

export type AuthorizeUserRequest = {
    privateKey: string,
    poolId: string,
    userAddress: string
}


export type StakeNFTsRequest = {
    privateKey: string,
    poolId: string,
    nfts: NFTStakeRequest[]
}

export type NFTStakeRequest = {
    type: string,
    objectId: string,
}

