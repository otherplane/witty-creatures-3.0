import { Static, Type, TSchema } from '@sinclair/typebox'
export { Db, Collection, ObjectId, WithId } from 'mongodb'

export const Nullable = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()])

export const ClaimPlayerParams = Type.Object({
  key: Type.String(),
})
export type ClaimPlayerParams = Static<typeof ClaimPlayerParams>

// Socials

export const Socials = Nullable(
  Type.Object({
    twitter: Type.Optional(Type.String()),
    discord: Type.Optional(Type.String()),
    telegram: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    company: Type.Optional(Type.String()),
    share: Type.Optional(Type.Boolean()),
  })
)

export type Socials = Static<typeof Socials>

// Configuration

export const ConfigParams = Type.Object({
  socials: Socials,
  mintConfig: Type.String(),
})

export type ConfigParams = Static<typeof ConfigParams>

export const ConfigResult = Type.Object({
  socials: Socials,
  mintConfig: Type.String(),
})
export type ConfigResult = Static<typeof ConfigResult>

//PlayerVTO

export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  nft: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
  color: Type.Integer(),
  socials: Socials,
  mintConfig: Type.String(),
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
  socials: Socials,
  mintConfig: Type.String(),
})

export type DbPlayerVTO = Static<typeof DbPlayerVTO>

//TODO: define Medal type
export const Medal = Type.String()
export type Medal = Static<typeof Medal>

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
  socialsFrom: Type.Optional(Socials),
  socialsTo: Type.Optional(Socials),
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
  to: Type.String(),
  points: Type.Number(),
  timestamp: Type.Number(),
  ends: Type.Number(),
  socialsTo: Socials,
  socialsFrom: Socials,
})
export type DbInteractionVTO = Static<typeof DbInteractionVTO>

export const ProtectedPlayerVTO = Type.Omit(PlayerVTO, ['token'])
export type ProtectedPlayerVTO = Static<typeof ProtectedPlayerVTO>

export const ExtendedPlayerVTO = Type.Object({
  player: ProtectedPlayerVTO,
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
    index: Type.Number(),
    rank: Type.Number(),
    score: Type.Number(),
    total: Type.Number(),
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
  socialsFrom: Socials,
  socialsTo: Socials,
})
export type InteractionResult = Static<typeof InteractionParams>

// Share Socials

export const ShareSocialsParams = Type.Object({
  id: Type.String(),
})
export type ShareSocialsParams = Static<typeof ShareSocialsParams>

export const ShareSocialsResult = Type.Object({
  points: Type.Number(),
  ends: Type.Number(),
  from: Type.String(),
  to: Type.String(),
  timestamp: Type.Number(),
  socialsFrom: Socials,
  socialsTo: Socials,
})
export type ShareSocialsResult = Static<typeof ShareSocialsResult>

// Leaderboard

export const PlayerLeaderboardInfo = Type.Object({
  username: Type.String(),
  score: Type.Integer(),
  position: Type.Integer(),
  creationIndex: Type.Integer(),
})
export type PlayerLeaderboardInfo = Static<typeof PlayerLeaderboardInfo>

export const LeaderboardParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  filter: Type.Optional(Type.String()),
})
export type LeaderboardParams = Static<typeof LeaderboardParams>

export const LeaderboardResponse = Type.Object({
  players: Type.Object({
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
    contacts: Type.Array(DbInteractionVTO),
    total: Type.Integer(),
  }),
})

export type ContactListResponse = Static<typeof ContactListResponse>
