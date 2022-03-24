import { Button, Row} from 'antd'
import React from 'react'
import styled from 'styled-components'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import bgImage from '../assets/banner/banner.png'

export default function HomePage() {
  return (
    <>    
    <DefaultPageTemplate bgGray fullWidth noMargin> 
      <S.Banner>
      </S.Banner>
      <S.Intro>
        <Row justify='center'>
          <span className='title'>WELCOME TO COOLBEEZ</span>
        </Row>
        <Row justify='center'>
          <span className='desc'>The COOLBeez is the first of a new generation of NFTs, designed to generate passive income for holders through the staking of NFTs.
            The COOLBeez collection has been created with the goal of developing the largest and most inclusive investment DAO in the world.
            The COOLBeez DAO is focused on the purchase and development of assets in the metaverse, meaning holders of the COOLBeez NFT and $COOLBEEZ tokens are on the
             frontline of investing in the most significant innovation of the 21th century. $COOLBEEZ tokens are earned through NFT staking, so you can sit back and allow your NFT to work for you.
          </span>
        </Row>
        <Row justify='center'>
          <a href='https://discord.com/invite/S8NRMqAH2F'><img alt='' src="icons/Discord.png" style={{width: '30px', height: '30px', margin: '10px 30px 10px 30px'}}></img></a>
          <a href='https://www.instagram.com/leaderinu'><img  alt='' src="icons/Instagram.png" style={{width: '30px', height: '30px', margin: '10px 30px 10px 30px'}}></img></a>
          <a href='https://twitter.com/vyndstad'><img  alt='' src="icons/Twitter.png" style={{width: '30px', height: '30px', margin: '10px 30px 10px 30px'}}></img></a>
        </Row>
      </S.Intro>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Banner: styled.div`
    width: 100%;
    height: 500px;
    background: url(${bgImage});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-bottom: 30px;
    @media (min-width: 300px) {
      height: 200px;
    }
    @media (min-width: 768px) {
      height: 350px;
    }
    @media (min-width: 1024px) {
      height: 500px;
    }
    @media (min-width: 1600px) {
      height: 600px;
    }
  `,  
  Intro: styled.div`
    border-bottom: 1px solid #ff9600;
    padding: 0px 10px;
    .title {
      color: #ff9600;
      font-size: 50px;
      font-weight: 900;
      font-family: Bungee;
      text-align: center;
    }
    .desc {
      color: ${props=>props.theme.gray[4]};
      font-size: 20px;
      text-align: center;
      margin: 20px 0px 10px 0px;
    }
    @media (min-width: 1024px) {
      padding: 0px 25px;
      .title {
        font-size: 60px;
      }
    }
  `,
  Mint: styled.div`
    margin-top: 60px;
    padding: 0px 10px;
    @media (min-width: 1024px) {
      padding: 0px 25px;
    }
    .title {
      color: #ba5a00;
      font-size: 40px;
      font-weight: 900;
      font-family: Bungee;
      text-align: center;
      margin-bottom: 40px;
    }
    .desc {
      color: ${props=>props.theme.gray[4]};
      font-size: 20px;
      text-align: center;
      margin: 20px 0px 30px 0px;
      width: 1100px;
    }
  `,
  PriceChart: styled.div`
    padding: 0px 10px;
    @media (min-width: 1024px) {
      padding: 0px 25px;
    }
    .title {
      color: #ba5a00;
      font-size: 25px;
      font-weight: 900;
      text-align: center;
      margin: 20px 0px;
    }
    .desc-lottery {
      color: ${props=>props.theme.gray[4]};
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
    .desc-price {
      color: ${props=>props.theme.gray[4]};
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin: 0px 0px 20px 0px;
    }
    @media (min-width: 1600px) {
      padding: 0px 300px;
    }
  `,
  Tokenomic: styled.div`
    margin-top: 80px;
    padding: 0px 10px;
    @media (min-width: 1024px) {
      padding: 0px 25px;
    }
    .title {
      color: #ff9600;
      font-size: 40px;
      font-weight: 900;
      font-family: Bungee;
      text-align: center;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #ba5a00;
      font-size: 25px;
      font-weight: 900;
      text-align: center;
      margin-bottom: 20px;
    }
    .desc {
      color: ${props=>props.theme.gray[4]};
      font-size: 20px;
      text-align: center;
      margin: 20px 0px 30px 0px;
      width: 1100px;
    }
    .token-table {
      overflow: scroll
    }
    .token-table::-webkit-scrollbar-thumb {
      height: 2px !important;
      background: rgba(120,120,120,0.4);
    }
  `,
  Button: styled(Button)`
    background: #ff9600;
    color: #fff;
    font-size: 20px;
    font-weight: 400;
    border: 1px solid #ff9600;
    border-radius: 20px !important;
    margin: 10px 10px;
    cursor: pointer !important;
    height: 40px;
    width: 300px;
    &:hover,
    &:active,
    &:focus {
      background-color: #ba5a00;
      color: #fff;
      border: 1px solid #ba5a00;
    }
  `,
  TokenNamePan: styled.div`
    background: #ff9600;
    border: 1px solid #ba5a00;
    border-top-left-radius: 30px;
    div {
      color: white;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      width: inherit;
      @media (max-width: 1024px) {
        font-size: 16px;
        font-weight: 400;
      }
    }
    width: inherit;
    padding: 10px 0px;
  `,
  TokenSymbolPan: styled.div`
    background: #ff9600;
    border: 1px solid #ba5a00;
    border-top-right-radius: 30px;
    div {
      color: white;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      width: inherit;
      @media (max-width: 1024px) {
        font-size: 16px;
        font-weight: 400;
      }
    }
    width: inherit;
    padding: 10px 0px;
  `,
  BuyTaxPan: styled.div`
    background: #ff9600;
    border: 1px solid #ba5a00;
    div {
      color: white;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      width: inherit;
      @media (max-width: 1024px) {
        font-size: 16px;
        font-weight: 400;
      }
    }
    width: inherit;
    padding: 15px 0px 15px;
  `,
  SellTaxPan: styled.div`
    background: #ff9600;
    border: 1px solid #ba5a00;
    div {
      color: white;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      width: inherit;
      @media (max-width: 1024px) {
        font-size: 16px;
        font-weight: 400;
      }
    }
    width: inherit;
    padding: 15px 0px 15px;
  `,
  BuyTaxNumPan: styled.div`
    border: 1px solid #ba5a00;
    border-top: 0px;
    div {
      color: ${props=>props.theme.gray[4]};;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      width: inherit;
      @media (max-width: 1024px) {
        font-size: 16px;
        font-weight: 400;
      }
    }
    width: inherit;
    padding: 25px 0px 25px;
  `,
  SellTaxNumPan: styled.div`
    border: 1px solid #ba5a00;
    border-top: 0px;
    div {
      color: ${props=>props.theme.gray[4]};;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      width: inherit;
      @media (max-width: 1024px) {
        font-size: 16px;
        font-weight: 400;
      }
    }
    width: inherit;
    padding: 25px 0px 25px;
  `,
  Roadmap: styled.div`
    margin-top: 80px;
    padding: 0px 10px;
    @media (min-width: 1024px) {
      padding: 0px 25px;
    }
    .title {
      color: #ff9600;
      font-size: 40px;
      font-weight: 900;
      font-family: Bungee;
      text-align: center;
      margin-bottom: 70px;
    }
    * {
      box-sizing: border-box;
    }
    .timeline {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
    }
    .timeline::after {
      content: '';
      position: absolute;
      width: 6px;
      background-color: #ba5a00;
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -3px;
    }
    .container {
      padding: 10px 40px;
      position: relative;
      background-color: inherit;
      width: 50%;
    }
    .container::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      right: -14px;
      background-color: #ff9600;
      border: 2px solid #ba5a00;
      top: 15px;
      border-radius: 50%;
      z-index: 1;
    }
    .left {
      left: 0;
    }
    .right {
      left: 50%;
    }
    .left::before {
      content: " ";
      height: 0;
      position: absolute;
      top: 22px;
      width: 0;
      z-index: 1;
      right: 30px;
      border: medium solid white;
      border-width: 10px 0 10px 10px;
      border-color: transparent transparent transparent #ff9600;
    }
    .right::before {
      content: " ";
      height: 0;
      position: absolute;
      top: 22px;
      width: 0;
      z-index: 1;
      left: 30px;
      border: medium solid white;
      border-width: 10px 10px 10px 0;
      border-color: transparent #ff9600 transparent transparent;
    }
    .right::after {
      left: -16px;
    }
    .content {
      padding: 20px 30px;
      background-color: white;
      position: relative;
      border-radius: 6px;
      border: 2px solid #ff9600;
    }
    .start {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: #ba5a00;
      left: 50%;
      border-radius: 50%;
      margin-left: -10px;
      margin-top: -19px;
    }
    .end {
      content: '';
      position: absolute;
      bottom: -10px;
      width: 20px;
      height: 20px;
      background-color: #ba5a00;
      left: 50%;
      border-radius: 50%;
      margin-left: -10px;
    }
    @media screen and (max-width: 600px) {
      /* Place the timelime to the left */
      .timeline::after {
        left: 31px;
      }
      .start {
        left: 31px;
      }
      .end {
        left: 31px;
      }
      /* Full-width containers */
      .container {
        width: 100%;
        padding-left: 70px;
        padding-right: 25px;
      }
      
      /* Make sure that all arrows are pointing leftwards */
      .container::before {
        left: 60px;
        border: medium solid white;
        border-width: 10px 10px 10px 0;
        border-color: transparent #ff9600 transparent transparent;
      }
    
      /* Make sure all circles are at the same spot */
      .left::after, .right::after {
        left: 15px;
      }
      
      /* Make all right containers behave like the left ones */
      .right {
        left: 0%;
      }
    }
  `,
  Whitepaper: styled.div`
    margin-top: 80px;
    padding: 0px 10px;
    @media (min-width: 1024px) {
      padding: 0px 25px;
    }
    .title {
      color: #ff9600;
      font-size: 40px;
      font-weight: 900;
      font-family: Bungee;
      text-align: center;
      margin-bottom: 10px;
    }
  `
}
