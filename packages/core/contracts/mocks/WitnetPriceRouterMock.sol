// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WitnetPriceRouterMock {

    string public caption;
    uint256 public price;

    constructor(
            string memory _caption,
            uint256 _price
        )
    {
        caption = _caption;
        price = _price;
    }

    function valueFor(
            bytes32 _erc2362id
        )
        external view
        returns (int, uint, uint)
    {
        require(
            supportsCurrencyPair(_erc2362id),
            "WitnetPriceRouterMock: unsupported currency pair"
        );
        return (
            int(price),
            block.timestamp,
            200
        );
    }

    function supportsCurrencyPair(bytes32 _erc2362id)
        public view
        returns (bool)
    {
        return (_erc2362id == keccak256(bytes(caption)));
    }
}