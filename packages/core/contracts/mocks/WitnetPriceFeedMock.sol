// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WitnetPriceFeedMock {

    int public price;

    constructor(int _price)
    {
        price = _price;
    }

    function lastValue()
        external view
        returns (int, uint, bytes32, uint)
    {
        return (price, 0, blockhash(block.number - 1), 0);
    }
}