// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWc3Decorator.sol";

/// @title Witty Creatures 3.0 Token only-owner interface.
/// @author Otherplane Labs, 2022.
interface IWc3Admin {

    /// Sets Opensea-compliant Decorator contract
    function setDecorator(
        IWc3Decorator
    ) external;

    /// Set estimated gas units required for minting one single token.
    /// @param _estimatedGasLimit Estimated gas units.
    function setMintGasOverhead(
        uint256 _estimatedGasLimit
    ) external;

    /// Change batch parameters. Only possible while in 'Batching' status.
    /// @param _expirationBlocks Number of blocks after Witnet randomness is generated, during which creatures may get minted.
    /// @param _totalEggs Max number of tokens that may eventually get minted.
    /// @param _percentileMarks Creature-category ordered percentile marks (Legendary first).    
    function setSettings(
        uint256 _expirationBlocks,
        uint256 _totalEggs,
        uint8[] calldata _percentileMarks
    ) external;

    /// Sets Externally Owned Account that is authorized to sign tokens' intrinsics before getting minted.
    /// @param _signator Externally-owned account to be authorized
    function setSignator(address _signator) external;

    /// Starts hatching, which means: (a) game settings cannot be altered anymore, (b) a 
    /// random number will be requested to the Witnet Decentralized Oracle Network, and (c)
    /// the contract will automatically turn to the 'Hatching' status as soon as the randomness
    /// gets solved by the Witnet oracle. While the randomness request gets solved, the contract will 
    /// remain in 'Randomizing' status.
    function startHatching() external payable;
}
