import { AbiItem } from 'web3-utils'
import factoryAbi from '../abi/factory.json'
import stakeAbi from '../abi/stake.json'
import rewardAbi from '../abi/erc20.json'

import { clearTransaction, handleTransaction, TransactionType } from '../variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'
import { factoryAddress } from '../config'

export const claimToken = async (chainId: number, ownerAddress: string, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    
    const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);

    try{
        let poolAddr

        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool < 1) return -1;

        poolAddr = await contractFactory.methods.getFarmingContract().call();
        

        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);

        let amount = await contractStake.methods.calcHarvestTot(ownerAddress).call();

        if(amount <= 0)
            return 0

        await contractStake.methods.harvestForUser(ownerAddress).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })
        
        return 1;
    } catch(e) {
        console.log(e)
    }

    return 0;
}

export const getRewardAmount = async (chainId: number, ownerAddress: string, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    
    const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);
    try{
        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool == 0) return 0;

        let poolAddr = await contractFactory.methods.getFarmingContract().call();

        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);
        let rewardTokenAddress = await contractStake.methods.rewardsTokenAddress().call();
        let amount = await contractStake.methods.calcHarvestTot(ownerAddress).call();
        console.log(amount)
        const contractRewardToken = new web3.eth.Contract(rewardAbi as AbiItem[], rewardTokenAddress);
        let rewardTokenDecimals = await contractRewardToken.methods.decimals().call();
        
        amount = Math.floor(amount*1000000/(10**(rewardTokenDecimals)))/1000000
        return amount
    } catch(e) {
        console.log(e)
    }

    return 0;
}

export const getTotalRewardAmount = async (chainId: number, ownerAddress: string, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    
    const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);
    try{
        let poolAddr
        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool < 1) return -1;

        poolAddr = await contractFactory.methods.getFarmingContract().call();

        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);
        let rewardTokenAddress = await contractStake.methods.rewardsTokenAddress().call();
        let amount = await contractStake.methods.getTotalRewardPaid(ownerAddress).call();

        const contractRewardToken = new web3.eth.Contract(rewardAbi as AbiItem[], rewardTokenAddress);
        let rewardTokenDecimals = await contractRewardToken.methods.decimals().call();
        
        amount = Math.floor(amount*1000000/(10**(rewardTokenDecimals)))/1000000
        return amount
        
    } catch(e) {
        console.log(e)
    }

    return 0;
}

export const getRewardTokenSymbol = async (chainId: number, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    
    const contractFactory = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);

    try{
        let poolAddr
        let isExistPool = await contractFactory.methods.getTotalStakingContracts().call();
        if(isExistPool < 1) return -1;

        poolAddr = await contractFactory.methods.getFarmingContract().call();


        const contractStake = new web3.eth.Contract(stakeAbi as AbiItem[], poolAddr);
        let rewardTokenAddress = await contractStake.methods.rewardsTokenAddress().call();

        const contractRewardToken = new web3.eth.Contract(rewardAbi as AbiItem[], rewardTokenAddress);
        let symbol = await contractRewardToken.methods.symbol().call();

        return symbol;
    } catch(e) {
        console.log(e)
    }

    return 'token';
}                                                                                                      