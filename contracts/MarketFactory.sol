// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";

contract MarketFactory {
    address[] public markets;

    event MarketCreated(
        address indexed marketAddress,
        string question,
        address indexed creator
    );

    function createMarket(string memory _question) 
        external returns (address) {
        // Another contract to verify market creation must be added here
        Market newMarket = new Market(_question, msg.sender);
        markets.push(address(newMarket));

        emit MarketCreated(address(newMarket), _question, msg.sender);
        return address(newMarket);
    }

    function getAllMarkets() external view returns (address[] memory) {
        return markets;
    }

    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}
