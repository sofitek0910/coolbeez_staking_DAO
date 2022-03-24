import { useReactiveVar } from '@apollo/client'
import { Button, Col, Row, Image } from 'antd'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { claimToken, getRewardAmount, getRewardTokenSymbol, getTotalRewardAmount } from '../services/TokenStakingService'
import { accountVar, chainIdVar, walletVar } from '../variables/WalletVariable'
import { notifyError, notifySuccess } from '../services/NotificationService'

export default function DashboardPage() {
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const wallettype = useReactiveVar(walletVar)
  const node = wallettype === 'walletconnect'? true : false

  const [rewardAmountNFT, setRewardAmountNFT] = useState(0)
  const [rewardSymbolNFT, setRewardSymbolNFT] = useState('token')

  const [totalRewardPaidNFT, setTotalRewardPaidNFT] = useState(0)


  const handleFilter = async (e, val) => {
    if(val === 'nft') {
      let bSuccess = await claimToken(chainId, account, node);
      if(bSuccess) {
        let w_totalreward = await getTotalRewardAmount(chainId, account, node)
        setTotalRewardPaidNFT(w_totalreward)

        notifySuccess('Withdraw successed!')
      } else {
        notifyError('You can not withdraw! Please stake bulls.')
      }
    }
  }

  useEffect(()=>{
    if(!chainId) return;
    if(!account) return;

    const getTokenSymbol = async () => {
      let rewardSymbolNft = await getRewardTokenSymbol(chainId, node)
      setRewardSymbolNFT(rewardSymbolNft)
    }
    
    const getTotalRewardPaid = async () => {
      let w_totalrewardNFT = await getTotalRewardAmount(chainId, account, node)
      setTotalRewardPaidNFT(w_totalrewardNFT)
    }
    
    getTokenSymbol()
    getTotalRewardPaid()

    let myInterval = setInterval(async () => {
      const rewardAmount = await getRewardAmount(chainId, account, node)
      setRewardAmountNFT(rewardAmount)  
    }, 10000);

    return ()=> {
      clearInterval(myInterval);
    };   
  },[chainId, account, node])

  return (
    <>    
    <DefaultPageTemplate bgGray > 
      <Row justify="center">
        <S.Image src='images/reward.png'></S.Image>
      </Row>
      <Row  justify="center" align="middle" style={{minHeight: '500px'}}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Row  justify="center">
            <S.Title>
              REWARD FOR NFT STAKING
            </S.Title>
            <S.Desc>
              Total Rewards Paid: {totalRewardPaidNFT} {rewardSymbolNFT}
            </S.Desc>
            <S.Desc>
              Available Value To Claim: {rewardAmountNFT} {rewardSymbolNFT}
            </S.Desc>
          </Row>
          <Row justify="center">  
            <S.Button onClick={(e:any)=>handleFilter(e, 'nft')}>⚡ Claim</S.Button>
          </Row>
        </Col>
      </Row>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Image: styled(Image)`
    margin: 40px 0px 30px;
    @media (min-width: 1024px) {
      margin: 40px 0px 0px;
    }
  `,
  Title: styled.p`
    color: #ff9600;
    width: 100%;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    font-family: Bungee;
    margin: 5px 5px 30px;
  `,
  Desc: styled.p`
    color: ${(props)=>props.theme.gray['4']};
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  `, 
  Button: styled(Button)`
    background: ${props=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
    font-weight: 600;
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 10px !important;
    padding: 5px 7px 5px 7px !important;
    cursor: pointer !important;
    height: 40px;
    width: 100%;
    margin: 50px 0px 30px;
    &:hover,
    &:active,
    &:focus {
      background-color: rgb(34, 106, 237);
    }
    @media (min-width: 768px) {
      width: 70%;
    }
  `
}