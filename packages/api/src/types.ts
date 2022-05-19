import { Static, Type } from '@sinclair/typebox'
export { Db, Collection, ObjectId, WithId } from 'mongodb'

export const ClaimPlayerParams = Type.Object({
  key: Type.String(),
})
export type ClaimPlayerParams = Static<typeof ClaimPlayerParams>

export enum RanchName {
  Ranch1 = 'Ranch1',
  Ranch2 = 'Ranch2',
  Ranch3 = 'Ranch3',
  Ranch4 = 'Ranch4',
  Ranch5 = 'Ranch5',
  Ranch6 = 'Ranch6',
}
export const RanchNameEnum = Type.Enum(RanchName)

export enum Trait {
  Vigor = 'vigor',
  Speed = 'speed',
  Stamina = 'stamina',
  Coolness = 'coolness',
  Coat = 'coolness',
  Agility = 'agility',
}
export const TraitEnum = Type.Enum(Trait)

export enum RanchIndex {
  Ranch1 = 0,
  Ranch2 = 1,
  Ranch3 = 2,
  Ranch4 = 3,
  Ranch5 = 4,
  Ranch6 = 5,
}

export const indexToRanch: Record<number, RanchName> = {
  [RanchIndex.Ranch1]: RanchName.Ranch1,
  [RanchIndex.Ranch2]: RanchName.Ranch2,
  [RanchIndex.Ranch3]: RanchName.Ranch3,
  [RanchIndex.Ranch4]: RanchName.Ranch4,
  [RanchIndex.Ranch5]: RanchName.Ranch5,
  [RanchIndex.Ranch6]: RanchName.Ranch6,
}

export const ranchToTrait: Record<RanchName, Trait> = {
  [RanchName.Ranch1]: Trait.Vigor,
  [RanchName.Ranch2]: Trait.Speed,
  [RanchName.Ranch3]: Trait.Stamina,
  [RanchName.Ranch4]: Trait.Coolness,
  [RanchName.Ranch5]: Trait.Coat,
  [RanchName.Ranch6]: Trait.Agility,
}

export const Resource = Type.Object({
  trait: TraitEnum,
  amount: Type.Number(),
})
export type Resource = Static<typeof Resource>

export const BufficornVTO = Type.Object({
  name: Type.String(),
  ranch: RanchNameEnum,
  [Trait.Vigor]: Type.Integer(),
  [Trait.Speed]: Type.Integer(),
  [Trait.Coolness]: Type.Integer(),
  [Trait.Stamina]: Type.Integer(),
  [Trait.Coat]: Type.Integer(),
  [Trait.Agility]: Type.Integer(),
  medals: Type.Array(Type.Optional(Type.String())),
})

export type BufficornVTO = Static<typeof BufficornVTO>

export const RanchVTO = Type.Object({
  name: RanchNameEnum,
  bufficorns: Type.Array(BufficornVTO),
  medals: Type.Array(Type.Optional(Type.String())),
  resource: Resource,
})

export type RanchVTO = Static<typeof RanchVTO>

export const DbRanchVTO = Type.Object({
  name: RanchNameEnum,
  resource: Resource,
  bufficorns: Type.Array(Type.String()),
  medals: Type.Array(Type.Optional(Type.String())),
})

export type DbRanchVTO = Static<typeof DbRanchVTO>

export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  points: Type.Integer(),
  lastTradeIn: Type.Optional(Type.Integer()),
  lastTradeOut: Type.Optional(Type.Integer()),
  medals: Type.Array(Type.Optional(Type.String())),
})

export type PlayerVTO = Static<typeof PlayerVTO>

export const DbPlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  points: Type.Integer(),
  lastTradeIn: Type.Optional(Type.Integer()),
  lastTradeOut: Type.Optional(Type.Integer()),
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

export const TradeParams = Type.Object({
  points: Type.Number(),
  to: Type.String(),
})
export type TradeParams = Static<typeof TradeParams>

export const TradeResult = Type.Object({
  points: Type.Number(),
  ends: Type.Number(),
  from: Type.String(),
  to: Type.String(),
  timestamp: Type.Number(),
})
export type TradeResult = Static<typeof TradeParams>

export const DbTradeVTO = Type.Object({
  from: Type.String(),
  to: Type.String(),
  points: Type.Number(),
  timestamp: Type.Number(),
  ends: Type.Number(),
})
export type DbTradeVTO = Static<typeof DbTradeVTO>

export type Stats = {
  vigor: number
  speed: number
  coolness: number
  stamina: number
  coat: number
  agility: number
}
