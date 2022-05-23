import { Static, Type, TSchema } from '@sinclair/typebox'
export { Db, Collection, ObjectId, WithId } from 'mongodb'

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()])

export const ClaimPlayerParams = Type.Object({
  key: Type.String(),
})
export type ClaimPlayerParams = Static<typeof ClaimPlayerParams>

export enum RanchIndex {
  Ranch1 = 0,
  Ranch2 = 1,
  Ranch3 = 2,
  Ranch4 = 3,
  Ranch5 = 4,
  Ranch6 = 5,
}

export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  medals: Type.Array(Type.Optional(Type.String())),
})

export type PlayerVTO = Static<typeof PlayerVTO>

export const DbPlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  score: Type.Integer(),
  medals: Type.Array(Type.Optional(Type.String())),
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

export type Stats = {
  vigor: number
  speed: number
  coolness: number
  stamina: number
  coat: number
  agility: number
}
