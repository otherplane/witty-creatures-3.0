// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../contracts/libs/Wc3Lib.sol";

contract Wc3LibTester {
    using Wc3Lib for bytes32;
    function randomUniform(bytes32 _seed, uint256 _index, uint8 _range)
        public pure
        returns (uint8)
    {
        return _seed.randomUint8(_index, _range);
    }
}