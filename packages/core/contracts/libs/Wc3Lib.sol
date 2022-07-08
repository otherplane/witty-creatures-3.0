// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "witnet-solidity-bridge/contracts/interfaces/IWitnetRandomness.sol";

/// @title Wc3Lib Library: data model and helper functions
/// @author Otherplane Labs, 2022.
library Wc3Lib {

    struct Storage {
        address decorator;
        address signator;
        Settings settings;

        uint256 mintGasOverhead;
        uint256 hatchingBlock;
        uint256 totalSupply;

        mapping (/* tokenId => WittyCreature */ uint256 => WittyCreature) intrinsics;
    }

    struct Settings {        
        uint256 expirationBlocks;
        uint256 totalEggs;
        uint8[] percentileMarks;
    }

    enum Status {
        Batching,
        Randomizing,
        Hatching,
        Frozen
    }

    struct WittyCreature {
        string  eggName;
        uint256 eggGlobalRanking;
        uint256 eggGuildRanking; /// @dev same as tokenId
        uint256 eggIndex;
        WittyCreatureRarity eggRarity;
        uint256 eggScore;
        uint256 mintBlock;
        uint256 mintGas;
        uint256 mintGasPrice;
        uint256 mintTimestamp;
        uint256 mintUsdCost6;
        bytes32 mintUsdPriceWitnetProof;
    }

    struct WittyCreatureTraits {
        uint8 background;
        uint8 eyes;
        uint8 head;
        uint8 mouth;
        uint8 object;
        uint8 outfit;  
    }

    enum WittyCreatureRarity {
        Legendary,  // 0
        Rare,       // 1
        Common      // 2
    }

    enum WittyCreatureStatus {
        Void,        // 0
        Incubating,  // 1
        Randomizing, // 2
        Hatching,    // 3
        Minted,      // 4
        Frozen       // 5
    }

    // Calculate length of string-equivalent to given bytes32.
    function length(bytes32 _bytes32)
        internal pure
        returns (uint _length)
    {
        for (; _length < 32; _length ++) {
            if (_bytes32[_length] == 0) {
                break;
            }
        }
    }

    /// Generates pseudo-random number uniformly distributed in range [0 .. _range).
    function randomUint8(bytes32 _seed, uint256 _index, uint _range)
        internal pure
        returns (uint8)
    {
        assert(_range > 0 && _range <= 256);
        uint8 _flagBits = uint8(255 - _msbDeBruijn32(uint32(_range)));
        uint256 _number = uint256(keccak256(abi.encode(_seed, _index))) & uint256(2 ** _flagBits - 1);
        return uint8((_number * _range) >> _flagBits); 
    }

    /// Calculate rarity index based on a creature's ranking percentile.
    function eggRarity(
            Storage storage self,
            uint _percentile100
        )
        internal view
        returns (WittyCreatureRarity)
    {
        uint8 _i; uint8 _cumuled;
        if (_percentile100 > 100) {
            _percentile100 = 100;
        }
        uint _length = self.settings.percentileMarks.length; 
        for (; _i < _length; _i ++) {
            _cumuled += self.settings.percentileMarks[_i];
            if (_percentile100 <= _cumuled) {
                break;
            }
        }
        return WittyCreatureRarity(_i);
    }

    /// Recovers address from hash and signature.
    function recoverAddr(bytes32 _hash, bytes memory _signature)
        internal pure
        returns (address)
    {
        if (_signature.length != 65) {
            return (address(0));
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return address(0);
        }
        if (v != 27 && v != 28) {
            return address(0);
        }
        return ecrecover(_hash, v, r, s);
    }    

    /// Gets tender's current status.
    function status(Storage storage self, IWitnetRandomness _randomizer)
        internal view
        returns (Status)
    {
        uint _hatchingBlock = self.hatchingBlock;
        uint _expirationBlocks = self.settings.expirationBlocks;
        if (_hatchingBlock > 0) {
            if (_randomizer.isRandomized(_hatchingBlock)) {
                if (_expirationBlocks > 0 && block.number > _hatchingBlock + _expirationBlocks) {
                    return Status.Frozen;
                } else {
                    return Status.Hatching;
                }
            } else {
                return Status.Randomizing;
            }
        } else {
            return Status.Batching;
        }
    }

    /// @dev Produces revert message when tender is not in expected status.
    function statusRevertMessage(Status _status)
        internal pure
        returns (string memory)
    {
        if (_status == Status.Frozen) {
            return "Wc3Lib: not in Frozen status";
        } else if (_status == Status.Batching) {
            return "Wc3Lib: not in Batching status";
        } else if (_status == Status.Randomizing) {
            return "Wc3Lib: not in Randomizing status";
        } else if (_status == Status.Hatching) {
            return "Wc3Lib: not in Hatching status";
        } else {
            return "Wc3Lib: bad mood";
        }
    }

    /// Gets tokens's current status.
    function tokenStatus(Storage storage self, IWitnetRandomness _randomizer, uint256 _tokenId)
        internal view
        returns (WittyCreatureStatus)
    {
        WittyCreature memory _wc3 = self.intrinsics[_tokenId];
        if (
            _tokenId == 0
                || _tokenId > self.settings.totalEggs
        ) {
            return WittyCreatureStatus.Void;
        }
        else if (_wc3.mintTimestamp > 0) {
            return WittyCreatureStatus.Minted;
        }
        else {
            uint _hatchingBlock = self.hatchingBlock;
            if (_hatchingBlock > 0) {
                if (_randomizer.isRandomized(_hatchingBlock)) {
                    uint _expirationBlocks = self.settings.expirationBlocks;
                    if (
                        _expirationBlocks > 0
                            && block.number > _hatchingBlock + _expirationBlocks
                    ) {
                        return WittyCreatureStatus.Frozen;
                    } else {
                        return WittyCreatureStatus.Hatching;
                    }
                } else {
                    return WittyCreatureStatus.Randomizing;
                }
            } else {
                return WittyCreatureStatus.Incubating;
            }
        }
    }

    /// Reduces string into bytes32.
    function toBytes32(string memory _string)
        internal pure
        returns (bytes32 _result)
    {
        if (bytes(_string).length == 0) {
            return 0x0;
        } else {
            assembly {
                _result := mload(add(_string, 32))
            }
        }
    }

    /// Converts bytes32 into hex string.
    function toHexString(bytes32 _bytes32)
        internal pure
        returns (string memory)
    {
        if (_bytes32 == 0) {
            return "0";
        } else {
            bytes32 _temp = _bytes32;
            uint _length;
            while (_temp != 0) {
                _length ++;
                _temp = _temp >> 4;
            }
            bytes memory _bstr = new bytes(_length);
            uint _k = _length;
            while (_bytes32 != 0) {
                uint _char = uint(_bytes32) & 0xf;
                _bstr[-- _k] = (_char > 9
                    ? bytes1(uint8(87 + _char)) // lower-case letters
                    : bytes1(uint8(48 + _char)) // decimal digits
                );
                _bytes32 = _bytes32 >> 4;
            }
            return string(_bstr);
        }
    }

    /// Converts bytes32 into string.
    function toString(bytes32 _bytes32)
        internal pure
        returns (string memory)
    {
        bytes memory _bytes = new bytes(length(_bytes32));
        for (uint _i = 0; _i < _bytes.length; _i ++) {
            _bytes[_i] = _bytes32[_i];
        }
        return string(_bytes);
    }

    /// Translate rarity index into a literal string.
    function toString(WittyCreatureRarity _rarity)
        internal pure
        returns (string memory)
    {
        if (_rarity == WittyCreatureRarity.Legendary) {
            return "Legendary";
        } else if (_rarity == WittyCreatureRarity.Rare) {
            return "Rare";
        } else {
            return "Common";
        }
    }

    /// Returns contract status string.
    function toString(Status _status)
        internal pure
        returns (string memory)
    {
        if (_status == Status.Batching) {
            return "Batching";
        } else if (_status == Status.Randomizing) {
            return "Randomizing";
        } else if (_status == Status.Hatching) {
            return "Hatching";
        } else {
            return "Frozen";
        }
    }
    
    /// Returns token status string.
    function toString(WittyCreatureStatus _status)
        internal pure
        returns (string memory)
    {
        if (_status == WittyCreatureStatus.Incubating) {
            return "Incubating";
        } else if (_status == WittyCreatureStatus.Randomizing) {
            return "Randomizing";
        } else if (_status == WittyCreatureStatus.Hatching) {
            return "Hatching";
        } else if (_status == WittyCreatureStatus.Minted) {
            return "Minted";
        } else if (_status == WittyCreatureStatus.Frozen) {
            return "Frozen";
        } else {
            return "Void";
        }
    }

    /// Returns index of Most Significant Bit of given number, applying De Bruijn O(1) algorithm.
    function _msbDeBruijn32(uint32 _v)
        private pure
        returns (uint8)
    {
        uint8[32] memory _bitPosition = [
                0, 9, 1, 10, 13, 21, 2, 29, 11, 14, 16, 18, 22, 25, 3, 30,
                8, 12, 20, 28, 15, 17, 24, 7, 19, 27, 23, 6, 26, 5, 4, 31
            ];
        _v |= _v >> 1;
        _v |= _v >> 2;
        _v |= _v >> 4;
        _v |= _v >> 8;
        _v |= _v >> 16;
        return _bitPosition[
            uint32(_v * uint256(0x07c4acdd)) >> 27
        ];
    }
}
