// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Witty Creatures 3.0 Token events.
/// @author Otherplane Labs, 2022.
interface IWc3Events {
    event Decorator(address decorator);
    event MintGasLimit(uint256 gas);
    event Settings(uint256 expirationBlocks, uint256 totalEggs, uint8[] percentileMarks);    
    event Signator(address signator);
}
