// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/Wc3Lib.sol";

/// @title Witty Creatures 3.0 Decorating interface.
/// @author Otherplane Labs, 2022.
interface IWc3Decorator {
    function baseURI() external view returns (string memory);
    function forged() external view returns (bool);
    function guildId() external view returns (uint256);
    function toJSON(bytes32, Wc3Lib.WittyCreature memory) external view returns (string memory);
    function version() external view returns (string memory);
}