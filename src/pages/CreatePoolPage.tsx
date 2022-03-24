import { useReactiveVar } from '@apollo/client'
import { Alert, Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { validate, numValidate } from '../services/ValidationService';
import {createPool, isExistPool, removePool} from '../services/CreatePoolService'
import { accountVar, chainIdVar, walletVar } from '../variables/WalletVariable'
import {createPoolOwner} from '../config'

export default function CreatePoolPage() {
  const history = useHistory()
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const wallettype = useReactiveVar(walletVar)
  const node = wallettype === 'walletconnect'? true : false

  const [rewardAddr, setRewardAddr] = useState<string>()
  const [tokenAddr, setTokenAddr] = useState<string>()
  const [supply, setSupply] = useState<number>()
  const [commonNFT, setCommonNFT] = useState<number>()
  const [rareNFT, setRareNFT] = useState<number>()
  const [queenNFT, setQueenNFT] = useState<number>()
  const [hyperNFT, setHyperNFT] = useState<number>()
  const [lockedTime, setLockedTime] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCreated, setIsCreated] = useState<boolean>(false)

  const handleKeyPress = (e: any, target: string) => {
    if(e.key === 'Enter'){
      document.getElementById(target).focus();           
    }
  }

  useEffect(()=>{    
    if(account !== createPoolOwner.toLowerCase()){
      history.push('/')
    }
  },[account])

  useEffect(()=>{
    const checkExistedPool = async () => {
      let isExist = await isExistPool(chainId, node);
      if (isExist) setIsCreated(true);
      else setIsCreated(false);
    }
    checkExistedPool();
  },[])

  const create = async () => {
    if(!validate('Reward Address', rewardAddr)) return;
    if(!validate('Stake Toke Address', tokenAddr)) return;
    if(!numValidate('Supply Amount', supply)) return;
    if(!numValidate('CommonAlloc Amount', commonNFT)) return;
    if(!numValidate('RareAlloc Amount', supply)) return;
    if(!numValidate('QueenAlloc Amount', supply)) return;
    if(!numValidate('HyperAlloc Amount', supply)) return;
    if(!numValidate('Locked Time', lockedTime)) return;
    setIsLoading(true)
    let result = await createPool(account, chainId, rewardAddr, tokenAddr, supply, commonNFT, rareNFT, queenNFT, hyperNFT, lockedTime, node);
    if(result) setIsCreated(true)
    setIsLoading(false)
  }

  const remove = async () => {
    setIsLoading(true)
    let result = await removePool(chainId, account, node);
    if(result) setIsCreated(false)
    setIsLoading(false)
  }

  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.SignupBox> 
          <S.TitleDiv>
            <div style={{fontSize: '28px', fontWeight: 'bold', color: '#ff9600', fontFamily: 'Bungee'}}>
              Creating Pool
            </div>                  
          </S.TitleDiv>  
          <div>
            <div>
              <S.Input maxLength={60} value={rewardAddr} placeholder="Rewards Token Address" onChange={(e: any) => setRewardAddr(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'token')} />
            </div>
            <div>
              <S.Input maxLength={60} id='token' value={tokenAddr} placeholder="Staked Token Address" onChange={(e: any) => setTokenAddr(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'supply')} />
            </div>
            <div>
              <S.Input maxLength={60} id='supply' type="number" value={supply} placeholder="Supply Amount" onChange={(e: any) => setSupply(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'common')} />
            </div>
            <div>
              <S.Input maxLength={60} id='common' type="number" value={commonNFT} placeholder="rewards amount per day for common NFTs" onChange={(e: any) => setCommonNFT(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'rare')} />
            </div>
            <div>
              <S.Input maxLength={60} id='rare' type="number" value={rareNFT} placeholder="rewards amount per day for rare NFTs" onChange={(e: any) => setRareNFT(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'queen')} />
            </div>
            <div>
              <S.Input maxLength={60} id='queen' type="number" value={queenNFT} placeholder="rewards amount per day for queen NFTs" onChange={(e: any) => setQueenNFT(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'hyper')} />
            </div>
            <div>
              <S.Input maxLength={60} id='hyper' type="number" value={hyperNFT} placeholder="rewards amount per day for hyper NFTs" onChange={(e: any) => setHyperNFT(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'time')} />
            </div>
            <div>
              <S.Input maxLength={60} id='time' type="number" value={lockedTime} placeholder="Locked Time(s)" onChange={(e: any) => setLockedTime(e.target.value)} onKeyPress={(e:any) => handleKeyPress(e, 'create')} />
            </div>
            <div style={{marginTop: '20px'}}>
              {isCreated?
                <S.Button id='remove' loading={isLoading} onClick={remove}>
                  Remove Pool
                </S.Button>
              :
                <S.Button id='create' loading={isLoading} onClick={create}>
                  Create Pool
                </S.Button>
              }              
            </div>
          </div>     
        </S.SignupBox>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  TitleDiv: styled.div`
    color: ${(props)=>props.theme.gray['4']};
    text-align: center;
    margin-bottom: 20px;
  `,
  Container: styled.div`
    width: 100%;
    justify-content: center;
    margin-top: 3vh;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 15vh;    
      display: flex;
    }
  `,
  Button: styled(Button)`
    border-radius: 8px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 150px;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    padding-bottom: 7px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      color: ${colors.white};
      opacity: 0.8;
      box-shadow: none;
      border: none;
    }
  `,
  Input: styled(Input)`
    border-radius: 5px;
    border: none;
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    margin-top: 20px;
    background: ${(props)=>props.theme.gray['0']};
    color: ${(props)=>props.theme.gray['4']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
  `,
  Alert: styled(Alert)`
    border-radius: 8px;
    font-weight: 400;

    .ant-alert-message {
      margin-bottom: 8px;
      font-size: 14px;
    }
  `,
  SignupBox: styled.div`
    width: 100%;
    max-width: 400px;
    height: 600px;
    display: block !important;
    padding: 20px;    
    border: 1px solid #d0d0d1;
    border-radius: 5px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: 50%;
      display: inline-block !important;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: 50%;
      display: inline-block !important;
    }
  `
}
