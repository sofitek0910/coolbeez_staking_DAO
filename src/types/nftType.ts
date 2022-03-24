export interface Erc721Attributes {
  trait_type: string
  value: string
}
export interface Erc721Metadata {
    tokenId: number
    name: string
    collectionName: string
    image_url: string
    isStaking: boolean
    attributes: Erc721Attributes[]
  }