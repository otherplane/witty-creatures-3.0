/* eslint-disable no-unused-vars */
import { Static, Type, TSchema } from '@sinclair/typebox'
export { Db, Collection, ObjectId, WithId } from 'mongodb'

export const Nullable = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()])

export const ClaimPlayerParams = Type.Object({
  key: Type.String(),
})
export type ClaimPlayerParams = Static<typeof ClaimPlayerParams>

// Socials

export const ExtendedSocial = Type.Object({
  timestamp: Type.Number(),
  ownerKey: Type.Optional(Type.String()),
  twitter: Type.Optional(Type.String()),
  discord: Type.Optional(Type.String()),
  telegram: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  company: Type.Optional(Type.String()),
  color: Type.Optional(Type.Number()),
})

export type ExtendedSocial = Static<typeof ExtendedSocial>

export const DbSocialVTO = Type.Object({
  ownerKey: Type.String(),
  twitter: Type.Optional(Type.String()),
  discord: Type.Optional(Type.String()),
  telegram: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  company: Type.Optional(Type.String()),
})

export type DbSocialVTO = Static<typeof DbSocialVTO>

export const Social = Type.Object({
  ownerKey: Type.String(),
  twitter: Type.Optional(Type.String()),
  discord: Type.Optional(Type.String()),
  telegram: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  company: Type.Optional(Type.String()),
})

export type Social = Static<typeof Social>

export const SocialParams = Type.Object({
  id: Type.String(),
})

export type SocialParams = Static<typeof SocialParams>

export const SocialResult = Nullable(
  Type.Object({
    ownerKey: Type.String(),
    twitter: Type.Optional(Nullable(Type.String())),
    discord: Type.Optional(Nullable(Type.String())),
    telegram: Type.Optional(Nullable(Type.String())),
    name: Type.Optional(Nullable(Type.String())),
    company: Type.Optional(Nullable(Type.String())),
  })
)

export type SocialResult = Static<typeof SocialResult>

// Configuration

export const ConfigParams = Type.Object({
  socials: Nullable(Social),
  shareConfig: Type.Boolean(),
  mintConfig: Type.Integer(),
})

export type ConfigParams = Static<typeof ConfigParams>

export const ConfigResult = Type.Object({
  socials: Nullable(SocialResult),
  shareConfig: Type.Boolean(),
  mintConfig: Type.Integer(),
})
export type ConfigResult = Static<typeof ConfigResult>

//PlayerVTO

export const ContactIndex = Type.Object({
  timestamp: Type.Number(),
  ownerKey: Type.String(),
})
export type ContactIndex = Static<typeof ContactIndex>

export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  nft: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
  color: Type.Integer(),
  shareConfig: Type.Boolean(),
  socials: Nullable(Social),
  contacts: Type.Array(Type.Optional(ContactIndex)),
  mintConfig: Type.Integer(),
})

export type PlayerVTO = Static<typeof PlayerVTO>

export const DbPlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  nft: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
  color: Type.Integer(),
  shareConfig: Type.Boolean(),
  socials: Nullable(Social),
  contacts: Type.Array(Type.Optional(ContactIndex)),
  mintConfig: Type.Integer(),
})

export type DbPlayerVTO = Static<typeof DbPlayerVTO>

//TODO: define NFT type
export const PlayerAward = Type.Object({
  category: Type.Number(),
  ranking: Type.Number(),
  playerId: Type.Number(),
})
export type PlayerAward = Static<typeof PlayerAward>

// Preview

export const PreviewImageNameReply = Type.Array(Type.String())
export type PreviewImageNameReply = Static<typeof PreviewImageNameReply>

export const PreviewParams = Type.Object({
  token_ids: Type.Array(Type.String()),
})
export type PreviewParams = Static<typeof PreviewParams>

export const PreviewReply = Type.Array(PlayerAward)

export type PreviewReply = Static<typeof PreviewReply>

// NFT
export enum MouthTrait {
  Bored = 'bored',
  Joint = 'joint',
  Lips = 'lips',
  Moustache = 'moustache',
  Rainbow = 'rainbow',
  Smile = 'smile',
}
export enum EyesTrait {
  Dealwithit = 'dealwithit',
  Laser = 'laser',
  Lashes = 'lashes',
  Makeup = 'makeup',
  Monocle = 'monocle',
  Pirate = 'pirate',
  Shades = 'shades',
  Wink = 'wink',
}
export enum HeadTrait {
  Afro = 'afro',
  Anime = 'anime',
  Cap = 'cap',
  Fancy = 'fancy',
  Mage = 'mage',
  Mohawk = 'mohawk',
  Pink = 'pink',
  Ponytail = 'ponytail',
  Santa = 'santa',
  Wig = 'wig',
}
export enum OutfitTrait {
  Gown = 'gown',
  Mage = 'mage',
  Santa = 'santa',
  Tiedye = 'tiedye',
  Tuxedo = 'tuxedo',
}
export enum ObjectTrait {
  Beer = 'beer',
  Bitcoin = 'bitcoin',
  Croissant = 'croissant',
  Dice = 'dice',
  Ether = 'ether',
  Flame = 'flame',
  Lipstick = 'lipstick',
  Mule = 'mule',
  Phone = 'phone',
  Wine = 'wine',
}
export enum BackgroundTrait {
  Hell = 'hell',
  Paris = 'paris',
  Space = 'space',
  Stonks = 'stonks',
  Vaporwave = 'vaporwave',
}

export enum ColorTrait {
  Emerald = 'emerald',
  Obsidian = 'obsidian',
  Ruby = 'ruby',
  Gold = 'gold',
  Sapphire = 'sapphire',
}

export const Network = Type.Object({
  name: Type.String(),
  id: Type.Integer(),
  contractAddress: Type.String(),
  rpcUrls: Type.Array(Type.String()),
})

export interface NetworkConfig {
  [key: number]: Static<typeof Network>
}

export interface Colors {
  [key: string]: string
}

export const Award = Type.Object({
  background: Type.String(BackgroundTrait),
  birthDate: Type.Integer(),
  eggColor: Type.String(ColorTrait),
  eyes: Type.String(EyesTrait),
  globalRanking: Type.Integer(),
  guild: Type.String(),
  guildRanking: Type.Integer(),
  head: Type.String(HeadTrait),
  mintCostUsd: Type.Number(),
  mouth: Type.String(MouthTrait),
  object: Type.String(ObjectTrait),
  outfit: Type.String(OutfitTrait),
  rarity: Type.String(),
  score: Type.Integer(),
})
export type Award = Static<typeof Award>

export const PlayerImagesReponse = Type.Array(
  Type.Object({
    svg: Type.String(),
  })
)
export type PlayerImagesReponse = Static<typeof PlayerImagesReponse>

export const IndexedEgg = Type.Intersect([
  PlayerVTO,
  Type.Object({ rarityIndex: Type.String() }),
])
export type IndexedEgg = Static<typeof IndexedEgg>

export const AuthorizationHeader = Type.Object({
  Authorization: Type.String(),
})
export type AuthorizationHeader = Static<typeof AuthorizationHeader>

export const GetByStringKeyParams = Type.Object({
  key: Type.String(),
})
export type GetByStringKeyParams = Static<typeof GetByStringKeyParams>

export const JwtVerifyPayload = Type.Object({
  id: Type.String(),
  iat: Type.Number(),
})
export type JwtVerifyPayload = Static<typeof JwtVerifyPayload>

export const EggProtected = Type.Object({
  color: Type.Number(),
  index: Type.Number(),
  rarityIndex: Type.String(),
  score: Type.Number(),
  username: Type.Optional(Type.String()),
})
export type EggProtected = Static<typeof EggProtected>

export const IncubateParams = Type.Object({
  target: Type.String(),
})
export type IncubateParams = Static<typeof IncubateParams>

export const Incubation = Type.Object({
  to: Type.String(),
  from: Type.String(),
  timestamp: Type.Number(),
  ends: Type.Number(),
  points: Type.Number(),
})
export type Incubation = Static<typeof Incubation>

export const ExtendedIncubation = Type.Object({
  to: Type.String(),
  from: Type.String(),
  timestamp: Type.Number(),
  ends: Type.Number(),
  points: Type.Number(),
  remainingDuration: Type.Number(),
  remainingCooldown: Type.Number(),
})
export type ExtendedIncubation = Static<typeof ExtendedIncubation>

export const DbInteractionVTO = Type.Object({
  from: Type.String(),
  fromNetwork: Type.Integer(),
  fromColor: Type.Number(),
  to: Type.String(),
  toNetwork: Type.Integer(),
  toColor: Type.Number(),
  points: Type.Number(),
  timestamp: Type.Number(),
  ends: Type.Number(),
})
export type DbInteractionVTO = Static<typeof DbInteractionVTO>

export const ProtectedPlayerVTO = Type.Omit(PlayerVTO, ['token'])
export type ProtectedPlayerVTO = Static<typeof ProtectedPlayerVTO>

export type GetTokenInfoResponse = {
  category: number
  ranking: number
}

export const ExtendedPlayerVTO = Type.Object({
  player: ProtectedPlayerVTO,
  guildRanking: Type.Integer(),
  globalRanking: Type.Integer(),
  lastInteractionIn: Nullable(DbInteractionVTO),
  lastInteractionOut: Nullable(DbInteractionVTO),
})

export type ExtendedPlayerVTO = Static<typeof ExtendedPlayerVTO>

export const MintParams = Type.Object({
  address: Type.String(),
})
export type MintParams = Static<typeof MintParams>

export const MintOutput = Type.Object({
  envelopedSignature: Type.Object({
    message: Type.String(),
    messageHash: Type.Optional(Type.String()),
    signature: Type.String(),
  }),
  data: Type.Object({
    address: Type.String(),
    username: Type.String(),
    globalRanking: Type.Number(),
    guildId: Type.Number(),
    guildPlayers: Type.Number(),
    guildRanking: Type.Number(),
    index: Type.Number(),
    score: Type.Number(),
  }),
})
export type MintOutput = Static<typeof MintOutput>

export const EggMetadata = Type.Object({
  // TODO: verify that it does not break anything with OpenSea
  token_id: Type.Number(),
  name: Type.String(),
  description: Type.String(),
  image_data: Type.String(),
  external_url: Type.String(),
  attributes: Type.Array(
    Type.Object({
      trait_type: Type.String(),
      value: Type.Union([Type.String(), Type.Number()]),
    })
  ),
})

export type EggMetadata = Static<typeof EggMetadata>

export const GetByNumericKeyParams = Type.Object({
  key: Type.Number(),
})
export type GetByNumericKeyParams = Static<typeof GetByNumericKeyParams>

// Interactions

export const InteractionParams = Type.Object({
  to: Type.String(),
})
export type InteractionParams = Static<typeof InteractionParams>

export const InteractionResult = Type.Object({
  points: Type.Number(),
  ends: Type.Number(),
  from: Type.String(),
  to: Type.String(),
  timestamp: Type.Number(),
})
export type InteractionResult = Static<typeof InteractionParams>

// Share Socials

export const ShareSocialsParams = Type.Object({
  to: Type.String(),
})
export type ShareSocialsParams = Static<typeof ShareSocialsParams>

export const ShareSocialsResult = Type.Object({
  to: Type.String(),
})
export type ShareSocialsResult = Static<typeof ShareSocialsResult>

// Leaderboard

export const PlayerLeaderboardInfo = Type.Object({
  username: Type.String(),
  network: Type.Integer(),
  score: Type.Integer(),
  position: Type.Integer(),
  creationIndex: Type.Integer(),
})
export type PlayerLeaderboardInfo = Static<typeof PlayerLeaderboardInfo>

export const LeaderboardParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  filter: Type.Integer(),
})
export type LeaderboardParams = Static<typeof LeaderboardParams>

export const LeaderboardResponse = Type.Object({
  global: Type.Object({
    players: Type.Array(PlayerLeaderboardInfo),
    total: Type.Integer(),
  }),
  network: Type.Object({
    players: Type.Array(PlayerLeaderboardInfo),
    total: Type.Integer(),
  }),
})
export type LeaderboardResponse = Static<typeof LeaderboardResponse>

// Interactions history

export const InteractionHistoryParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
})

export type InteractionHistoryParams = Static<typeof InteractionHistoryParams>

export const InteractionHistoryResponse = Type.Object({
  interactions: Type.Object({
    interactions: Type.Array(DbInteractionVTO),
    total: Type.Integer(),
  }),
})

export type InteractionHistoryResponse = Static<
  typeof InteractionHistoryResponse
>

// Contacts

export const ContactListParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
})

export type ContactListParams = Static<typeof ContactListParams>

export const ContactListResponse = Type.Object({
  contacts: Type.Object({
    contacts: Type.Array(ExtendedSocial),
    total: Type.Integer(),
  }),
})

export type ContactListResponse = Static<typeof ContactListResponse>
