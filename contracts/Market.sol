// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Market {
    // Another contract checking market resolution to be added
    address public creator;
    string public name;
    uint256 public yesShares;
    uint256 public noShares;
    uint256 public totalVolume;

    mapping(address => uint256) public userYes;
    mapping(address => uint256) public userNo;

    constructor(string memory _question, address _creator) {
        creator = _creator;
        name = _question;
        yesShares = 1; // Market Maker's approximation taken here
        noShares = 1; // Market Maker's approximation taken here
    }

    function getChances() public view returns (uint256 yesChance, uint256 noChance) {
        uint256 total = yesShares + noShares;
        yesChance = (yesShares * 100) / total;
        noChance = (noShares * 100) / total;
    }

    function getSharePrice(bool isYes) public view returns (uint256 price) {
        (uint256 yesChance, uint256 noChance) = getChances();
        price = isYes
            ? (100 - yesChance) * 1e14  // Price decreases as chance increases
            : (100 - noChance) * 1e14;
    }

    function buyShares(bool isYes, uint256 amount) external payable {
        uint256 price = getSharePrice(isYes);
        uint256 cost = price * amount;
        require(msg.value >= cost, "Insufficient ETH sent");

        if (isYes) {
            yesShares += amount;
            userYes[msg.sender] += amount;
        } else {
            noShares += amount;
            userNo[msg.sender] += amount;
        }

        totalVolume += cost;
    }

    function sellShares(bool isYes, uint256 amount) external {
        uint256 price = getSharePrice(isYes);
        uint256 payout = price * amount;
        
        if (isYes) {
            require(userYes[msg.sender] >= amount, "Not enough YES shares");
            userYes[msg.sender] -= amount;
            yesShares -= amount;
        } else {
            require(userNo[msg.sender] >= amount, "Not enough NO shares");
            userNo[msg.sender] -= amount;
            noShares -= amount;
        }

        payable(msg.sender).transfer(payout);
        totalVolume -= payout;
    }
}
