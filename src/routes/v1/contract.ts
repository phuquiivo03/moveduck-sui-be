import { Router } from "express";
import { contractService } from "../../services";
import { AuthorizeUserRequest, StakeNFTsRequest, StakeTokenRequest } from "../../dto/contract";

const router  = Router();

router.post("/createBounty", async (req, res) => {
    try {

        const privateKey = req.body.privateKey;
        const result = await contractService.createBounty(privateKey);
        res.status(200).json(result);
    }catch(e){
        res.status(400).json({message: e});
    }
});

router.post("/stakeToken", async (req, res) => {
    const stakeTokenRequest: StakeTokenRequest = req.body;
    const result = await contractService.stakeToken(stakeTokenRequest);
    res.status(200).json(result);
})

router.post("/authorUser", async (req, res) => {
    try {
        const authorRequest: AuthorizeUserRequest = req.body;
        const result = await contractService.authorizeUser(authorRequest);
        res.status(200).json(result);
    }catch(e) {
        res.status(400).json({message: e});
    }
});

router.get("/claim/:linkId", async (req, res) => {
    const linkId = req.params.linkId;
    const result = await contractService.claim(linkId);
    if(result == null)
    {
        res.status(404).json({message: "Link not found"});
        return;
    }
    res.status(200).json(result);
});

router.post("/stakeNfts", async (req, res) => {
    try {
        const stakeNftsRequest: StakeNFTsRequest = req.body;
        const result = await contractService.stakeNFTs(stakeNftsRequest);
        res.status(200).json(result);
    }catch(e) {
        res.status(400).json(e);
    }
})

router.get("/latestPoolId", async (req, res) => {
    const result = await contractService.latestPoolId();
    res.status(200).json(result);
})


export default router;