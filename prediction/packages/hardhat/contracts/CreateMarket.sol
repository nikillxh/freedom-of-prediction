// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";

contract MarketCreator {
    event MarketCreated(
        address indexed marketAddress,
        address indexed creator
    );

    function createMarket(string memory _marketName, string[] memory _marketTracks, uint256 _deadline, string memory _source) 
    external returns (address) {
        Market newMarket = new Market(_marketName, _marketTracks, msg.sender, _deadline, _source);

        emit MarketCreated(address(newMarket), msg.sender);
        return address(newMarket);
    }
}