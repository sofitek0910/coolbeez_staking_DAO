import { useReactiveVar } from '@apollo/client'
import { Button, Input,Checkbox, Col, Row } from 'antd'
import React, { useState, useEffect, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import { FooterCardStakingLoading } from '../components/staking/FooterCardStakingLoading'
import EmptyState from '../components/shared/EmptyState'
import { CardTemplate } from '../components/shared/template/cards/CardTemplate'
import { Erc721Metadata } from '../types/nftType'
import { colorsV2 } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { getNFTIds, getNFTs, stakeToken, unStakeToken } from '../services/NFTStakingService'
import { accountVar, chainIdVar, walletVar } from '../variables/WalletVariable'
import { notifyError } from '../services/NotificationService'
import {paginationLimit} from '../config'

export default function StakePage() {
  const chainId = useReactiveVar(chainIdVar)
  const account = useReactiveVar(accountVar)
  const wallettype = useReactiveVar(walletVar)
  const node = wallettype === 'walletconnect'? true : false

  const [nfts, setNfts] = useState<Erc721Metadata[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [incomplete, setIncomplete] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fracApiVersion, setFracApiVersion] = useState<1 | 2>(2)
  const [nftIds, setNftIds] = useState<Array<string>>([])
  const [isstaked, setIsStaked] = useState<boolean>(false) 
  const [isShouldHarvest, setIsShouldHarvest] = useState<boolean>(false)
  const [selectedItems, setSelectedItem] = useState([]);
  const [commonNFT, setCommonNFT] = useState(0)
  const [rareNFT, setRareNFT] = useState(0)
  const [queenNFT, setQueenNFT] = useState(0)
  const [hyperNFT, setHyperNFT] = useState(0)

  const loader = (
    <S.CardsContainer>
      {[...Array(paginationLimit)].map(() => (
        <CardTemplate key={`loading-${Math.random()}`} loading chainId={Number(chainId)}>
          <FooterCardStakingLoading loading />
        </CardTemplate>
      ))}
    </S.CardsContainer>
  )

  const handleFilter = async (e, val) => {
    setLoading(true)
    if(val === 'stake') {
      if(selectedItems.length <= 0) {
        notifyError('Please select items.')
        return
      }
      let staked = await stakeToken(chainId, account, selectedItems, commonNFT, rareNFT, queenNFT, hyperNFT, node);
      if(staked === 1) {
        setNftIds([])
        setSelectedItem([])
        setIsStaked(!isstaked);
      } else if(staked === -1){
        notifyError('Stake Pool is not created.')
      } else {
        notifyError('Stakeing failed. Unknown error occured.')
      }
    } else if(val === 'unstake') {
      let unstaked = await unStakeToken(chainId, account, isShouldHarvest, node);
      if(unstaked === 1) {
        setNftIds([])
        setSelectedItem([])
        setIsStaked(!isstaked);
      } else if(unstaked === -1){
        notifyError('Stake Pool is not Created')
      } else {
        notifyError('Unstakeing failed. Unkown error accured.')
      }
    }
    setLoading(false)
  }

  useEffect(()=>{
    if(!chainId) return;
    if(!account) return;
    const getIds = async () => {
      let ids = await getNFTIds(chainId, account, node);      
      setNftIds(ids)
    }
    getIds();
 
  },[chainId, account, isstaked])
  
  const setFilteredNfts = useCallback(
    (items: Erc721Metadata[]) => {
      setNfts(items)
    },
    [chainId]
  )

  const addItems = useCallback(
    (nftItems: Erc721Metadata[]) => {
      setFilteredNfts(nfts.concat(nftItems))
    },
    [nfts, setFilteredNfts]
  )

  useEffect(() => {
    if (chainId && account) {
      const getInitialNfts = async () => {
        setLoading(true)
        setHasMore(true)

        const nftItems = await getNFTs(
          node,
          chainId,
          account,
          nftIds,
          paginationLimit,
          0
        )
        
        setFilteredNfts(nftItems)
        setOffset(nftItems.length)
        setLoading(false)

        if (nftItems.length < paginationLimit) {
          setHasMore(false)
        }
      }
      getInitialNfts()
    } else {
      setLoading(false)
      setHasMore(false)
    }
  }, [chainId, nftIds, isstaked, paginationLimit, setFilteredNfts])

  const loadMore = useCallback(
    async (customOffset?: number, customPaginationLimit?: number) => {
      if (chainId && account) {
        const nftItems = await getNFTs(
          node,
          chainId,
          account,
          nftIds,
          customPaginationLimit || paginationLimit,
          customOffset || offset
        )

        if (nftItems) {
          const newOffset = offset + nftItems.length
          addItems(nftItems)
          setOffset(newOffset)
        }

        if (nftItems.length < paginationLimit && fracApiVersion === 2) {
          setFracApiVersion(1)
          if (paginationLimit - nftItems.length > 0) {
            setIncomplete(true)
          }
        } else if (fracApiVersion === 1) {
          setHasMore(false)
          setLoading(false)
        }
      }
    },
    [addItems, chainId, isstaked, fracApiVersion, offset, paginationLimit]
  )

  useEffect(() => {
    if (incomplete) {
      loadMore(0, 100)
      setIncomplete(false)
    }
  }, [fracApiVersion, incomplete, loadMore])

  const remove = (name, rewardType) => {
    const arr = selectedItems.filter((item) => item !== name);
    setSelectedItem(arr);
    if(rewardType === 'Background_Common')
    {
      setCommonNFT(commonNFT - 1)
    } else if(rewardType === 'Background_Naked') {
      setRareNFT(rareNFT - 1)
    } else if(rewardType === 'Background_Queen') {
      setQueenNFT(queenNFT - 1)
    } else if(rewardType === 'Background_Solo') {
      setHyperNFT(hyperNFT - 1)
    }
  };

  const selectItem = (val, isStaking, rewardType) => {
    if(isStaking) return

    let exist: boolean = false;
    selectedItems.map(item => {
      if(val === item) {
        exist = true;
      }
    });
    if(exist) {
      remove(val, rewardType);
    }
    else {
      setSelectedItem([...selectedItems, val]);
      if(rewardType === 'Background_Common')
      {
        setCommonNFT(commonNFT + 1)
      } else if(rewardType === 'Background_Naked') {
        setRareNFT(rareNFT + 1)
      } else if(rewardType == 'Background_Queen') {
        setQueenNFT(queenNFT + 1)
      } else if(rewardType === 'Background_Solo') {
        setHyperNFT(hyperNFT + 1)
      }
    }
  }

  return ( 
    <DefaultPageTemplate bgGray> 
      <S.FilterDiv>        
        <S.Filter>
          <div>Selected {selectedItems.length} Items</div>         
          <S.Button onClick={(e:any)=>handleFilter(e, 'stake')}>🎉 Stake</S.Button> 
          <S.Harvest>
            <S.Checkbox checked={isShouldHarvest} onChange={event => setIsShouldHarvest(event.target.checked)} />
            <span> Harvest</span>
          </S.Harvest>     
          <S.Button onClick={(e:any)=>handleFilter(e, 'unstake')}>🎉 UnStake</S.Button>        
        </S.Filter>
      </S.FilterDiv>
      {!loading && !nfts.length && <EmptyState />}
      <InfiniteScroll next={loadMore} hasMore={hasMore} loader={loader} dataLength={nfts.length}>
        <S.CardsContainer>
          {nfts.map(nftItem => {
            const image = String(nftItem?.image_url)
            return (
              <CardTemplate
                onClick = {() => selectItem(nftItem.tokenId, nftItem?.isStaking, nftItem?.attributes[0].trait_type)}
                key={`${nftItem.name}`}
                image={image}
                name={String(nftItem?.name)}
                collectionName={nftItem?.collectionName}
                rewardType={nftItem?.attributes[0].trait_type}
                isStaking = {nftItem?.isStaking}
                chainId={Number(chainId)}>
              </CardTemplate>
            )
          })}
        </S.CardsContainer>
      </InfiniteScroll>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Select: styled.div`
    margin-top: 20px;
    .ant-radio-wrapper {
      color: ${(props)=>props.theme.gray['4']};
      font-size: 16px;
    }
    .ant-radio-inner{
      background-color: ${(props)=>props.theme.gray['0']} !important;
    }
    .ant-radio-inner::after {
      background-color: ${props=>props.theme.pink.main} ;
    }
    .ant-radio-checked .ant-radio-inner {
      border-color: ${props=>props.theme.pink.main} ;
    }
    .ant-radio-checked::after {
      border: 1px solid ${props=>props.theme.pink.main} !important;
    }
    .ant-radio-inner:hover {
      border-color: ${props=>props.theme.pink.main} ;
    }
    .ant-radio-input:focus + .ant-radio-inner {
      box-shadow : none !important;
    }
  `,
  Checkbox: styled(Checkbox)`
    .ant-checkbox-inner {
      border-radius: 50%;
    }
  `,
  TrendDiv: styled.div `
    font-size: 33px;
    font-weight: 600;
    color: ${props => props.theme.black};
  `,
  ExpDiv: styled.div `
    font-size: 33px;
    font-weight: 600;
    margin-top: -7px;
    display: inline-block;
    color: ${props => props.theme.black};
  `,
  FilterDiv: styled.div `
    width: 100%;
    display: block;
    box-shadow: none;
    margin-bottom: 20px;
    justify-content: space-between;
    margin-top: 20px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      display: flex;
    }
    div {
      color: ${props=>props.theme.gray['4']};
      font-size: 20px;
      margin-top: 5px;
      @media (min-width: 320px) {
        font-size: 14px;
      }
      @media (min-width: 768px) {
        font-size: 16px;
      }
    }
  `,
  Filter: styled.div`
    overflow: scroll;
    display: flex;
    column-gap: 8px;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      column-gap: 40px;
    }
  `,
  Harvest: styled.span`
    color: ${props=>props.theme.gray['4']};
    font-size: 14px;
    font-weight: 400;
    margin-top: 10px;
    display: inline-block;
    white-space: nowrap;
  `,
  SliderDiv: styled.div `
    margin: 1.3rem 0 1.3rem 0;
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      margin: 2rem 0 2rem 0;
    }
  `,
  Title: styled.div `
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props:any)=>props.theme.black}
  `,
  Button: styled(Button)`
    background: ${props=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 10px !important;
    padding: 5px 7px 5px 7px !important;
    cursor: pointer !important;
    height: 40px;

    &:hover,
    &:active,
    &:focus {
      background-color: rgb(34, 106, 237);
    }
    @media (min-width: 414px) {
      padding: 5px 13px 5px 13px !important;
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 0px;
      margin-right: 0px !important;
    }
  `,
  Input: styled(Input)`
    padding: 0.375rem 0.75rem;
    fontSize: 0.875rem;
    lineHeight: 1.5;
    color: ${(props)=>props.theme.gray['4']};
    background: ${(props)=>props.theme.gray['0']};
    backgroundClip: padding-box;
    border: 1px solid ${(props)=>props.theme.gray['2']};
    borderRadius: 0.25rem;
    marginBottom: 10px;
    width: 100%;
    display: inline-block;

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: calc(100% - 230px);
    }
  `,
  CardsContainer: styled.div`
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 4vw;
    justify-content: flex-start;
    align-items: flex-start;

    > div:last-of-type {
      margin-bottom: 4vw;
    }

    @media (min-width: ${props => props.theme.viewport.tablet}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: ${props => props.theme.viewport.desktop}) {
      grid-template-columns: repeat(3, 1fr);

      > div:last-of-type {
        margin-bottom: 4vw;
      }
    }

    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2vw;

      > div:last-of-type {
        margin-bottom: 2vw;
      }
    }
  `,  
  LoadMoreButton: styled(Button)`
    width: 100%;
    max-width: 304px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    color: ${colorsV2.white};
    background-image: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    margin: 0 auto;

    &:active,
    &:focus,
    &:hover {
      opacity: 0.75;
      color: ${colorsV2.white};
      background-image: linear-gradient(90deg, #fe8367 5.73%, #fe7688 100%);
    }
  `,
  Row: styled(Row) `
  `,
  Col: styled(Col)`
  `
}
