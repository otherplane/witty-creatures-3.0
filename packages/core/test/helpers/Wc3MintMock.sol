// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/interfaces/IWc3Events.sol";
import "../../contracts/interfaces/IWc3Surrogates.sol";
import "../../contracts/libs/Wc3Lib.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract Wc3MintMock is IWc3Surrogates, IWc3Events {
    using Wc3Lib for Wc3Lib.Storage;

    Wc3Lib.Storage internal __storage;

    constructor(
            address _signator // public key of backend server
        )
    {        
        __storage.signator = _signator;
        __storage.settings.totalEggs = 100;
    }

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
        )
        external
        override
    {
        // Verify guildfundamental facts:
        _verifyGuildFacts(
            _guildId,
            _guildPlayers,
            _guildRanking
        );

        // Verify signature:
        _verifySignature(
            _tokenOwner,
            _name,
            _globalRanking,
            _guildId,
            _guildPlayers,
            _guildRanking,
            _index,
            _score,            
            _signature
        );

        __storage.totalSupply ++;
    }

    function _verifyGuildFacts(
            uint _guildId,
            uint _guildPlayers,
            uint _guildRanking
        )
        internal view
        virtual
    {
        // not in tests // require(_guildId == block.chainid, "Wc3MintMock: bad guild");
        
        require(_guildPlayers > 0, "Wc3MintMock: no players");
        require(_guildPlayers <= __storage.settings.totalEggs, "Wc3MintMock: bad players");
        
        require(_guildRanking > 0, "Wc3MintMock: no ranking");
        require(_guildRanking <= _guildPlayers, "Wc3MintMock: bad ranking");
    }

    function _verifySignature(
            address _tokenOwner,
            string memory _name,
            uint256 _globalRanking,
            uint256 _guildId,
            uint256 _guildPlayers,
            uint256 _guildRanking,
            uint256 _index,
            uint256 _score,
            bytes memory _signature
        )
        internal view
        virtual
    {
        bytes32 _hash = keccak256(abi.encode(
            _tokenOwner,
            _name,
            _globalRanking,
            _guildId,
            _guildPlayers,
            _guildRanking,
            _index,
            _score
        ));
        require(
            Wc3Lib.recoverAddr(_hash, _signature) == __storage.signator,
            "Wc3MintMock: bad signature"
        );
    }

}