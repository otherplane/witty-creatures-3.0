// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Witty Creatures 3.0 Token surrogating interface.
/// @author Otherplane Labs, 2022.
interface IWc3Surrogates {
    function mint(
        address _tokenOwner,
        string calldata _name,
        uint256 _globalRanking,
        uint256 _guildId,
        uint256 _guildPlayers,
        uint256 _guildRanking,
        uint256 _index,
        uint256 _score,
        bytes calldata _signature
    ) external;
}
