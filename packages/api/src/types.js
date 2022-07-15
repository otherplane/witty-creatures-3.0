"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.LeaderboardParams = exports.PlayerLeaderboardInfo = exports.ShareSocialsResult = exports.ShareSocialsParams = exports.InteractionResult = exports.InteractionParams = exports.GetByNumericKeyParams = exports.EggMetadata = exports.MintOutput = exports.MintParams = exports.ExtendedPlayerVTO = exports.ProtectedPlayerVTO = exports.DbInteractionVTO = exports.ExtendedIncubation = exports.Incubation = exports.IncubateParams = exports.EggProtected = exports.JwtVerifyPayload = exports.GetByStringKeyParams = exports.AuthorizationHeader = exports.IndexedEgg = exports.PlayerImagesReponse = exports.Award = exports.Network = exports.ColorTrait = exports.BackgroundTrait = exports.ObjectTrait = exports.OutfitTrait = exports.HeadTrait = exports.EyesTrait = exports.MouthTrait = exports.PreviewReply = exports.PreviewParams = exports.PreviewImageNameReply = exports.PlayerAward = exports.DbPlayerVTO = exports.PlayerVTO = exports.ContactIndex = exports.ConfigResult = exports.ConfigParams = exports.SocialResult = exports.SocialParams = exports.Social = exports.DbSocialVTO = exports.ExtendedSocial = exports.ClaimPlayerParams = exports.Nullable = exports.ObjectId = exports.Collection = exports.Db = void 0;
exports.ContactListResponse = exports.ContactListParams = exports.InteractionHistoryResponse = exports.InteractionHistoryParams = exports.LeaderboardResponse = void 0;
/* eslint-disable no-unused-vars */
var typebox_1 = require("@sinclair/typebox");
var mongodb_1 = require("mongodb");
__createBinding(exports, mongodb_1, "Db");
__createBinding(exports, mongodb_1, "Collection");
__createBinding(exports, mongodb_1, "ObjectId");
var Nullable = function (type) {
    return typebox_1.Type.Union([type, typebox_1.Type.Null()]);
};
exports.Nullable = Nullable;
exports.ClaimPlayerParams = typebox_1.Type.Object({
    key: typebox_1.Type.String()
});
// Socials
exports.ExtendedSocial = typebox_1.Type.Object({
    timestamp: typebox_1.Type.Number(),
    ownerKey: typebox_1.Type.Optional(typebox_1.Type.String()),
    twitter: typebox_1.Type.Optional(typebox_1.Type.String()),
    discord: typebox_1.Type.Optional(typebox_1.Type.String()),
    telegram: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    company: typebox_1.Type.Optional(typebox_1.Type.String()),
    color: typebox_1.Type.Optional(typebox_1.Type.Number())
});
exports.DbSocialVTO = typebox_1.Type.Object({
    ownerKey: typebox_1.Type.String(),
    twitter: typebox_1.Type.Optional(typebox_1.Type.String()),
    discord: typebox_1.Type.Optional(typebox_1.Type.String()),
    telegram: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    company: typebox_1.Type.Optional(typebox_1.Type.String())
});
exports.Social = typebox_1.Type.Object({
    ownerKey: typebox_1.Type.String(),
    twitter: typebox_1.Type.Optional(typebox_1.Type.String()),
    discord: typebox_1.Type.Optional(typebox_1.Type.String()),
    telegram: typebox_1.Type.Optional(typebox_1.Type.String()),
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    company: typebox_1.Type.Optional(typebox_1.Type.String())
});
exports.SocialParams = typebox_1.Type.Object({
    id: typebox_1.Type.String()
});
exports.SocialResult = (0, exports.Nullable)(typebox_1.Type.Object({
    ownerKey: typebox_1.Type.String(),
    twitter: typebox_1.Type.Optional((0, exports.Nullable)(typebox_1.Type.String())),
    discord: typebox_1.Type.Optional((0, exports.Nullable)(typebox_1.Type.String())),
    telegram: typebox_1.Type.Optional((0, exports.Nullable)(typebox_1.Type.String())),
    name: typebox_1.Type.Optional((0, exports.Nullable)(typebox_1.Type.String())),
    company: typebox_1.Type.Optional((0, exports.Nullable)(typebox_1.Type.String()))
}));
// Configuration
exports.ConfigParams = typebox_1.Type.Object({
    socials: (0, exports.Nullable)(exports.Social),
    shareConfig: typebox_1.Type.Boolean(),
    mintConfig: typebox_1.Type.Integer()
});
exports.ConfigResult = typebox_1.Type.Object({
    socials: (0, exports.Nullable)(exports.SocialResult),
    shareConfig: typebox_1.Type.Boolean(),
    mintConfig: typebox_1.Type.Integer()
});
//PlayerVTO
exports.ContactIndex = typebox_1.Type.Object({
    timestamp: typebox_1.Type.Number(),
    ownerKey: typebox_1.Type.String()
});
exports.PlayerVTO = typebox_1.Type.Object({
    key: typebox_1.Type.String(),
    token: typebox_1.Type.Optional(typebox_1.Type.String()),
    username: typebox_1.Type.String(),
    score: typebox_1.Type.Integer(),
    nft: typebox_1.Type.Array(typebox_1.Type.Optional(typebox_1.Type.String())),
    creationIndex: typebox_1.Type.Integer(),
    color: typebox_1.Type.Integer(),
    shareConfig: typebox_1.Type.Boolean(),
    socials: (0, exports.Nullable)(exports.Social),
    contacts: typebox_1.Type.Array(typebox_1.Type.Optional(exports.ContactIndex)),
    mintConfig: typebox_1.Type.Integer()
});
exports.DbPlayerVTO = typebox_1.Type.Object({
    key: typebox_1.Type.String(),
    token: typebox_1.Type.Optional(typebox_1.Type.String()),
    username: typebox_1.Type.String(),
    score: typebox_1.Type.Integer(),
    nft: typebox_1.Type.Array(typebox_1.Type.Optional(typebox_1.Type.String())),
    creationIndex: typebox_1.Type.Integer(),
    color: typebox_1.Type.Integer(),
    shareConfig: typebox_1.Type.Boolean(),
    socials: (0, exports.Nullable)(exports.Social),
    contacts: typebox_1.Type.Array(typebox_1.Type.Optional(exports.ContactIndex)),
    mintConfig: typebox_1.Type.Integer()
});
//TODO: define NFT type
exports.PlayerAward = typebox_1.Type.Object({
    category: typebox_1.Type.Number(),
    ranking: typebox_1.Type.Number(),
    playerId: typebox_1.Type.Number()
});
// Preview
exports.PreviewImageNameReply = typebox_1.Type.Array(typebox_1.Type.String());
exports.PreviewParams = typebox_1.Type.Object({
    token_ids: typebox_1.Type.Array(typebox_1.Type.String())
});
exports.PreviewReply = typebox_1.Type.Array(exports.PlayerAward);
// NFT
var MouthTrait;
(function (MouthTrait) {
    MouthTrait["Bored"] = "bored";
    MouthTrait["Joint"] = "joint";
    MouthTrait["Lips"] = "lips";
    MouthTrait["Moustache"] = "moustache";
    MouthTrait["Rainbow"] = "rainbow";
    MouthTrait["Smile"] = "smile";
})(MouthTrait = exports.MouthTrait || (exports.MouthTrait = {}));
var EyesTrait;
(function (EyesTrait) {
    EyesTrait["Dealwithit"] = "dealwithit";
    EyesTrait["Laser"] = "laser";
    EyesTrait["Lashes"] = "lashes";
    EyesTrait["Makeup"] = "makeup";
    EyesTrait["Monocle"] = "monocle";
    EyesTrait["Pirate"] = "pirate";
    EyesTrait["Shades"] = "shades";
    EyesTrait["Wink"] = "wink";
})(EyesTrait = exports.EyesTrait || (exports.EyesTrait = {}));
var HeadTrait;
(function (HeadTrait) {
    HeadTrait["Afro"] = "afro";
    HeadTrait["Anime"] = "anime";
    HeadTrait["Cap"] = "cap";
    HeadTrait["Fancy"] = "fancy";
    HeadTrait["Mage"] = "mage";
    HeadTrait["Mohawk"] = "mohawk";
    HeadTrait["Pink"] = "pink";
    HeadTrait["Ponytail"] = "ponytail";
    HeadTrait["Santa"] = "santa";
    HeadTrait["Wig"] = "wig";
})(HeadTrait = exports.HeadTrait || (exports.HeadTrait = {}));
var OutfitTrait;
(function (OutfitTrait) {
    OutfitTrait["Gown"] = "gown";
    OutfitTrait["Mage"] = "mage";
    OutfitTrait["Santa"] = "santa";
    OutfitTrait["Tiedye"] = "tiedye";
    OutfitTrait["Tuxedo"] = "tuxedo";
})(OutfitTrait = exports.OutfitTrait || (exports.OutfitTrait = {}));
var ObjectTrait;
(function (ObjectTrait) {
    ObjectTrait["Beer"] = "beer";
    ObjectTrait["Bitcoin"] = "bitcoin";
    ObjectTrait["Croissant"] = "croissant";
    ObjectTrait["Dice"] = "dice";
    ObjectTrait["Ether"] = "ether";
    ObjectTrait["Flame"] = "flame";
    ObjectTrait["Lipstick"] = "lipstick";
    ObjectTrait["Mule"] = "mule";
    ObjectTrait["Phone"] = "phone";
    ObjectTrait["Wine"] = "wine";
})(ObjectTrait = exports.ObjectTrait || (exports.ObjectTrait = {}));
var BackgroundTrait;
(function (BackgroundTrait) {
    BackgroundTrait["Hell"] = "hell";
    BackgroundTrait["Paris"] = "paris";
    BackgroundTrait["Space"] = "space";
    BackgroundTrait["Stonks"] = "stonks";
    BackgroundTrait["Vaporwave"] = "vaporwave";
})(BackgroundTrait = exports.BackgroundTrait || (exports.BackgroundTrait = {}));
var ColorTrait;
(function (ColorTrait) {
    ColorTrait["Emerald"] = "emerald";
    ColorTrait["Obsidian"] = "obsidian";
    ColorTrait["Ruby"] = "ruby";
    ColorTrait["Gold"] = "gold";
    ColorTrait["Sapphire"] = "sapphire";
})(ColorTrait = exports.ColorTrait || (exports.ColorTrait = {}));
exports.Network = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    id: typebox_1.Type.Integer(),
    contractAddress: typebox_1.Type.String(),
    rpcUrls: typebox_1.Type.Array(typebox_1.Type.String())
});
exports.Award = typebox_1.Type.Object({
    background: typebox_1.Type.String(BackgroundTrait),
    birthDate: typebox_1.Type.Integer(),
    eggColor: typebox_1.Type.String(ColorTrait),
    eyes: typebox_1.Type.String(EyesTrait),
    globalRanking: typebox_1.Type.Integer(),
    guild: typebox_1.Type.String(),
    guildRanking: typebox_1.Type.Integer(),
    head: typebox_1.Type.String(HeadTrait),
    mintCostUsd: typebox_1.Type.Number(),
    mouth: typebox_1.Type.String(MouthTrait),
    object: typebox_1.Type.String(ObjectTrait),
    outfit: typebox_1.Type.String(OutfitTrait),
    rarity: typebox_1.Type.String(),
    score: typebox_1.Type.Integer()
});
exports.PlayerImagesReponse = typebox_1.Type.Array(typebox_1.Type.Object({
    svg: typebox_1.Type.String()
}));
exports.IndexedEgg = typebox_1.Type.Intersect([
    exports.PlayerVTO,
    typebox_1.Type.Object({ rarityIndex: typebox_1.Type.String() }),
]);
exports.AuthorizationHeader = typebox_1.Type.Object({
    Authorization: typebox_1.Type.String()
});
exports.GetByStringKeyParams = typebox_1.Type.Object({
    key: typebox_1.Type.String()
});
exports.JwtVerifyPayload = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    iat: typebox_1.Type.Number()
});
exports.EggProtected = typebox_1.Type.Object({
    color: typebox_1.Type.Number(),
    index: typebox_1.Type.Number(),
    rarityIndex: typebox_1.Type.String(),
    score: typebox_1.Type.Number(),
    username: typebox_1.Type.Optional(typebox_1.Type.String())
});
exports.IncubateParams = typebox_1.Type.Object({
    target: typebox_1.Type.String()
});
exports.Incubation = typebox_1.Type.Object({
    to: typebox_1.Type.String(),
    from: typebox_1.Type.String(),
    timestamp: typebox_1.Type.Number(),
    ends: typebox_1.Type.Number(),
    points: typebox_1.Type.Number()
});
exports.ExtendedIncubation = typebox_1.Type.Object({
    to: typebox_1.Type.String(),
    from: typebox_1.Type.String(),
    timestamp: typebox_1.Type.Number(),
    ends: typebox_1.Type.Number(),
    points: typebox_1.Type.Number(),
    remainingDuration: typebox_1.Type.Number(),
    remainingCooldown: typebox_1.Type.Number()
});
exports.DbInteractionVTO = typebox_1.Type.Object({
    from: typebox_1.Type.String(),
    fromNetwork: typebox_1.Type.Integer(),
    fromColor: typebox_1.Type.Number(),
    to: typebox_1.Type.String(),
    toNetwork: typebox_1.Type.Integer(),
    toColor: typebox_1.Type.Number(),
    points: typebox_1.Type.Number(),
    timestamp: typebox_1.Type.Number(),
    ends: typebox_1.Type.Number()
});
exports.ProtectedPlayerVTO = typebox_1.Type.Omit(exports.PlayerVTO, ['token']);
exports.ExtendedPlayerVTO = typebox_1.Type.Object({
    player: exports.ProtectedPlayerVTO,
    guildRanking: typebox_1.Type.Integer(),
    globalRanking: typebox_1.Type.Integer(),
    lastInteractionIn: (0, exports.Nullable)(exports.DbInteractionVTO),
    lastInteractionOut: (0, exports.Nullable)(exports.DbInteractionVTO)
});
exports.MintParams = typebox_1.Type.Object({
    address: typebox_1.Type.String()
});
exports.MintOutput = typebox_1.Type.Object({
    envelopedSignature: typebox_1.Type.Object({
        message: typebox_1.Type.String(),
        messageHash: typebox_1.Type.Optional(typebox_1.Type.String()),
        signature: typebox_1.Type.String()
    }),
    data: typebox_1.Type.Object({
        address: typebox_1.Type.String(),
        username: typebox_1.Type.String(),
        globalRanking: typebox_1.Type.Number(),
        guildId: typebox_1.Type.Number(),
        guildPlayers: typebox_1.Type.Number(),
        guildRanking: typebox_1.Type.Number(),
        index: typebox_1.Type.Number(),
        score: typebox_1.Type.Number()
    })
});
exports.EggMetadata = typebox_1.Type.Object({
    // TODO: verify that it does not break anything with OpenSea
    token_id: typebox_1.Type.Number(),
    name: typebox_1.Type.String(),
    description: typebox_1.Type.String(),
    image_data: typebox_1.Type.String(),
    external_url: typebox_1.Type.String(),
    attributes: typebox_1.Type.Array(typebox_1.Type.Object({
        trait_type: typebox_1.Type.String(),
        value: typebox_1.Type.Union([typebox_1.Type.String(), typebox_1.Type.Number()])
    }))
});
exports.GetByNumericKeyParams = typebox_1.Type.Object({
    key: typebox_1.Type.Number()
});
// Interactions
exports.InteractionParams = typebox_1.Type.Object({
    to: typebox_1.Type.String()
});
exports.InteractionResult = typebox_1.Type.Object({
    points: typebox_1.Type.Number(),
    ends: typebox_1.Type.Number(),
    from: typebox_1.Type.String(),
    to: typebox_1.Type.String(),
    timestamp: typebox_1.Type.Number()
});
// Share Socials
exports.ShareSocialsParams = typebox_1.Type.Object({
    to: typebox_1.Type.String()
});
exports.ShareSocialsResult = typebox_1.Type.Object({
    to: typebox_1.Type.String()
});
// Leaderboard
exports.PlayerLeaderboardInfo = typebox_1.Type.Object({
    username: typebox_1.Type.String(),
    network: typebox_1.Type.Integer(),
    score: typebox_1.Type.Integer(),
    position: typebox_1.Type.Integer(),
    creationIndex: typebox_1.Type.Integer()
});
exports.LeaderboardParams = typebox_1.Type.Object({
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    offset: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    filter: typebox_1.Type.Integer()
});
exports.LeaderboardResponse = typebox_1.Type.Object({
    global: typebox_1.Type.Object({
        players: typebox_1.Type.Array(exports.PlayerLeaderboardInfo),
        total: typebox_1.Type.Integer()
    }),
    network: typebox_1.Type.Object({
        players: typebox_1.Type.Array(exports.PlayerLeaderboardInfo),
        total: typebox_1.Type.Integer()
    })
});
// Interactions history
exports.InteractionHistoryParams = typebox_1.Type.Object({
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    offset: typebox_1.Type.Optional(typebox_1.Type.Integer())
});
exports.InteractionHistoryResponse = typebox_1.Type.Object({
    interactions: typebox_1.Type.Object({
        interactions: typebox_1.Type.Array(exports.DbInteractionVTO),
        total: typebox_1.Type.Integer()
    })
});
// Contacts
exports.ContactListParams = typebox_1.Type.Object({
    limit: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    offset: typebox_1.Type.Optional(typebox_1.Type.Integer())
});
exports.ContactListResponse = typebox_1.Type.Object({
    contacts: typebox_1.Type.Object({
        contacts: typebox_1.Type.Array(exports.ExtendedSocial),
        total: typebox_1.Type.Integer()
    })
});
