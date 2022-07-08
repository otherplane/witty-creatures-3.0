// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WitnetPriceFeedMock.sol";

contract WitnetPriceRouterMock {

    string public caption;
    uint public price;

    WitnetPriceFeedMock internal __priceFeedMock;

    constructor(
            string memory _caption,
            int _lastPrice
        )
    {
        caption = _caption;
        price = uint(_lastPrice);
        __priceFeedMock = new WitnetPriceFeedMock(_lastPrice);
    }

    function getPriceFeed(bytes32)
        external view
        returns (address)
    {
        return address(__priceFeedMock);
    }

    function currencyPairId(
            string memory _caption
        )
        public pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_caption));
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