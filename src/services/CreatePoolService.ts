import { AbiItem } from 'web3-utils'
import factoryAbi from '../abi/factory.json'
import erc20Abi from '../abi/erc20.json'
import { clearTransaction, handleTransaction, TransactionType } from '../variables/TransactionVariable'
import { initializeWeb3 } from './MultiWalletService'
import {factoryAddress} from '../config'
import { notifyError } from '../services/NotificationService'

export const createPool = async (ownerAddress: string, chainId: number, rewardAddr: string, tokenAddr: string, supply: number, commonAlloc: number, rareAlloc: number, queenAlloc: number, hyperAlloc: number, lockedTime: number, node: boolean) => {
    let w_ret = false;

    const web3 = initializeWeb3(chainId, node)
    const contractErc20 = new web3.eth.Contract(erc20Abi as AbiItem[], rewardAddr);
    const contractMinter = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress) 
    const rewardTokenDecimals = await contractErc20.methods.decimals().call();

    let num256 = supply * 10 ** rewardTokenDecimals
    const _bigSupply = '0x' + num256.toString(16)

    num256 = commonAlloc * 10 ** rewardTokenDecimals
    const _bigCommonAlloc = '0x' + num256.toString(16)

    num256 = rareAlloc * 10 ** rewardTokenDecimals
    const _bigRareAlloc = '0x' + num256.toString(16)

    num256 = queenAlloc * 10 ** rewardTokenDecimals
    const _bigQueenAlloc = '0x' + num256.toString(16)

    num256 = hyperAlloc * 10 ** rewardTokenDecimals
    const _bigHyperAlloc = '0x' + num256.toString(16)

    let alloc = [_bigCommonAlloc, _bigRareAlloc, _bigQueenAlloc, _bigHyperAlloc]
    try{
        await contractErc20.methods.increaseAllowance(factoryAddress, _bigSupply).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        });
        await contractMinter.methods.createNewTokenContract(rewardAddr, tokenAddr, _bigSupply, alloc, lockedTime).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })    
        w_ret = true;
    }
    catch(e) {
        console.log(e)
    }

    return w_ret;
}

export const isExistPool = async (chainId: number, node: boolean) => {
    let w_ret = 0;
    const web3 = initializeWeb3(chainId, node);    

    const contractMinter = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);
    
    w_ret = await contractMinter.methods.getTotalStakingContracts().call();

    if(w_ret > 0)
        return true
    
    return false
}

export const removePool = async (chainId: number, ownerAddress: string, node: boolean) => {    
    const web3 = initializeWeb3(chainId, node);    

    const contractMinter = new web3.eth.Contract(factoryAbi as AbiItem[], factoryAddress);

    try{
        let poolAddr = await contractMinter.methods.farmingContract().call();

        await contractMinter.methods.removeTokenContract(poolAddr).send({ from: ownerAddress }, (_error: Error, tx: string) => {
            tx ? handleTransaction(tx, TransactionType.mint) : clearTransaction()
        })    
        return true;
    } catch(e) {
        notifyError('Locked Time')
    }

    return false;
}
