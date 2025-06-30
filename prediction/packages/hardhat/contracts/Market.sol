// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "prb-math/contracts/PRBMathSD59x18.sol";
import "./Resolver.sol";

contract Market {
// Chainlink variables
    address public resolver;

// Resolution variables
    uint256 public deadline;
    uint256 internal yesT;
    uint256 internal noT;
    uint256 internal yesVolRatio;
    uint256 internal noVolRatio;
    uint256 internal yesRate;
    uint256 internal noRate;
    bool public marketResolved;

// LMSR variables
    using PRBMathSD59x18 for int256;
    int256 public constant B = 1e18;

// Construction
    address public proposer;
    string public source;

// Market info
    string public marketName;
    Track[] public tracks;
    uint256 public totalVolume;
    uint256 public totalStaked;

// Base
    uint8 base = 18;

// Trader definition
    mapping (address => uint256) public traderCapital;
    mapping (address => mapping(uint256 trackID => uint256)) public trackCredits;
    mapping (address => mapping(uint256 trackID => uint256)) public trackYesShares;
    mapping (address => mapping(uint256 trackID => uint256)) public trackNoShares;

// Market definition
    struct Track {
        uint256 id;
        uint256 yesShares;
        uint256 noShares;
        uint256 buyYes;
        uint256 sellYes;
        uint256 buyNo;
        uint256 sellNo;
        uint256 probability;
        uint256 volume;
        string marketTrack;
    }

// Construction
    function createDefaultMarket(string memory _marketTrack, uint256 _id) internal pure 
    returns (Track memory) {
    return Track({
        id: _id,
        yesShares: 0,
        noShares: 0,
        buyYes: 5100,
        sellYes: 4900,
        buyNo: 5100,
        sellNo: 4900,
        probability: 5000, // Represents 50.00% using basis points
        volume: 0,
        marketTrack: _marketTrack
    });
    }

    constructor (string memory _marketName, string[] memory _marketTracks, address _proposer, uint256 _deadline, string memory _source) {
        tracks.push(createDefaultMarket("", 0));
        for (uint256 i = 1; i <= _marketTracks.length; i++) {
            tracks.push(createDefaultMarket(_marketTracks[i-1], i));
        }
        proposer = _proposer;
        deadline = block.timestamp + _deadline;
        marketName = _marketName;
        source = _source;

        MarketResolver resolverContract = new MarketResolver(_marketName, _marketTracks, _deadline, address(this));
        resolver = address(resolverContract);
    }

// Market & Tracks Info
    function timeLeft() public view returns (uint256) {
        if (deadline >= block.timestamp) { return (deadline - block.timestamp);}
        else {return 0;}
    }

    function trackProbability(uint256 trackID) public view returns (uint256) {
        require(trackID > 0 && trackID < tracks.length, "Not a valid track!");
        return (tracks[trackID].probability);
    }

// Market status modifiers
    modifier marketOnline() {
        require(!marketResolved, "Market Resolved!");
        require(block.timestamp < deadline, "Resolve Market!");
        _;
    }

    modifier marketEnded() {
        require(marketResolved, "Market Resolved!");
        _;
    }

// User staking credits
    function credInc() internal {
        // require (msg.value > 0, "Send some credits");
        traderCapital[msg.sender] += msg.value;
        totalStaked += msg.value;
        for (uint256 i = 1; i <= tracks.length; i++) {
            trackCredits[msg.sender][i] += msg.value;
        }
    } 

    function stake() external payable marketOnline {
        credInc();
    }

    receive() external payable marketOnline { 
        credInc();
    }

// Buy shares
    function buyYesShares(uint256 trackID, uint256 amount) public marketOnline {
        uint256 price = calculateBuyCostYes(tracks[trackID].yesShares, tracks[trackID].noShares, amount);
        require(trackCredits[msg.sender][trackID] >= price, "Not enuf credits");
        trackCredits[msg.sender][trackID] -= price;
        trackYesShares[msg.sender][trackID] += amount;
        tracks[trackID].yesShares += amount;
        tracks[trackID].volume += price;
        tracks[trackID].probability = getProbability(
            tracks[trackID].yesShares, tracks[trackID].noShares);
        totalVolume += price;
    }

    function buyNoShares(uint256 trackID, uint256 amount) public marketOnline {
        uint256 price = calculateBuyCostNo(tracks[trackID].yesShares, tracks[trackID].noShares, amount);
        require(trackCredits[msg.sender][trackID] >= price, "Not enuf credits");
        trackCredits[msg.sender][trackID] -= price;
        trackNoShares[msg.sender][trackID] += amount;
        tracks[trackID].noShares += amount;
        tracks[trackID].volume += price;
        tracks[trackID].probability = getProbability(
            tracks[trackID].yesShares, tracks[trackID].noShares);
        totalVolume += price;
    }

// Sell shares
    function sellYesShares(uint256 trackID, uint256 amount) public marketOnline {
        uint256 price = calculateSellRevenueYes(tracks[trackID].yesShares, tracks[trackID].noShares, amount);
        require(trackYesShares[msg.sender][trackID] >= amount, "Not enuf shares");
        trackYesShares[msg.sender][trackID] -= amount;
        trackCredits[msg.sender][trackID] += price;
        tracks[trackID].yesShares -= amount;
        tracks[trackID].volume -= price;
        tracks[trackID].probability = getProbability(
            tracks[trackID].yesShares, tracks[trackID].noShares);
        totalVolume += price;
    }

    function sellNoShares(uint256 trackID, uint256 amount) public marketOnline {
        uint256 price = calculateSellRevenueNo(tracks[trackID].yesShares, tracks[trackID].noShares, amount);
        require(trackNoShares[msg.sender][trackID] >= amount, "Not enuf shares");
        trackNoShares[msg.sender][trackID] -= amount;
        trackCredits[msg.sender][trackID] += price;
        tracks[trackID].noShares -= amount;
        tracks[trackID].volume -= price;
        tracks[trackID].probability = getProbability(
            tracks[trackID].yesShares, tracks[trackID].noShares);
        totalVolume += price;
    }

// Calculate buy cost
    function calculateBuyCostYes(uint256 qYes, uint256 qNo, uint256 amount) 
    public pure returns (uint256 _finalCost) {
        int256 costBefore = LMSRCost(qYes, qNo);
        int256 costAfter = LMSRCost(qYes + amount, qNo);
        int256 rawCost = costAfter - costBefore;
        uint256 finalCost = uint256(PRBMathSD59x18.mul(rawCost, 1e4));

        // Cap minimum and maximum cost
        if (finalCost < 100) {
            finalCost = 100;
        }

        return (finalCost);
    }

    function calculateBuyCostNo(uint256 qYes, uint256 qNo, uint256 amount) 
    public pure returns (uint256 _finalCost) {
        int256 costBefore = LMSRCost(qYes, qNo);
        int256 costAfter = LMSRCost(qYes, qNo + amount);
        int256 rawCost = costAfter - costBefore;
        uint256 finalCost = uint256(PRBMathSD59x18.mul(rawCost, 1e4));

        // Cap minimum and maximum cost
        if (finalCost < 100) {
            finalCost = 100;
        }

        return finalCost;
    }

// Calculate sell cost
    function calculateSellRevenueYes(
        uint256 qYes,
        uint256 qNo,
        uint256 amount
    ) public pure returns (uint256 revenue) {
        require(amount <= qYes, "Not enough YES shares to sell");

        int256 costBefore = LMSRCost(qYes, qNo);
        int256 costAfter = LMSRCost(qYes - amount, qNo);
        int256 rawRevenue = costBefore - costAfter;

        revenue = uint256(PRBMathSD59x18.mul(rawRevenue, 1e4));

        // Cap minimum revenue at 100, max at 9900
        if (revenue < 100) {
            revenue = 100;
        }
    }

    function calculateSellRevenueNo(
        uint256 qYes,
        uint256 qNo,
        uint256 amount
    ) public pure returns (uint256 revenue) {
        require(amount <= qNo, "Not enough NO shares to sell");

        int256 costBefore = LMSRCost(qYes, qNo);
        int256 costAfter = LMSRCost(qYes, qNo - amount);
        int256 rawRevenue = costBefore - costAfter;

        revenue = uint256(PRBMathSD59x18.mul(rawRevenue, 1e4));

        // Cap minimum revenue at 100, max at 9900
        if (revenue < 100) {
            revenue = 100;
        }
    }

// LMSR cost assist function
    function LMSRCost(uint256 qYes, uint256 qNo) internal pure returns (int256) {
        int256 expYes = PRBMathSD59x18.exp(
            PRBMathSD59x18.div(int256(qYes * 1e18), B)
        );
        int256 expNo = PRBMathSD59x18.exp(
            PRBMathSD59x18.div(int256(qNo * 1e18), B)
        );
        int256 sumExp = expYes + expNo;
        return PRBMathSD59x18.mul(B, PRBMathSD59x18.ln(sumExp));
    }

// LMSR Bonding Curve
    function getProbability(uint256 qYes, uint256 qNo) public pure returns (uint256 prob) {
        // Assume qYes, qNo, and B are scaled normally (not fixed-point yet)
        int256 yesExp = PRBMathSD59x18.exp(PRBMathSD59x18.div(int256(qYes * 1e18), B));
        int256 noExp  = PRBMathSD59x18.exp(PRBMathSD59x18.div(int256(qNo * 1e18), B));
        int256 sumExp = yesExp + noExp;

        int256 probRaw = PRBMathSD59x18.div(yesExp, sumExp);  // Value in 1e18 precision
        prob = uint256(PRBMathSD59x18.mul(probRaw, 10000e18) / 1e18);  // scaled to 4-digit fixed-point (e.g 7532 = 75.32%)
    }


// Withdraw Pack
    function TrackPayout(uint256 _trackID) public view marketEnded returns (uint256) {
        require(yesT == _trackID || noT == _trackID, "No amount");
        if (yesT == _trackID) {
            require(trackYesShares[msg.sender][_trackID] != 0, "YES shares not left!");
            uint256 credits = (trackCredits[msg.sender][_trackID] * yesVolRatio) / 10000;
            uint256 amount = trackYesShares[msg.sender][_trackID] * yesRate;
            amount += credits;
            return amount;
        } else {
            require(trackNoShares[msg.sender][_trackID] != 0, "NO shares not left!");
            uint256 credits = (trackCredits[msg.sender][_trackID] * noVolRatio) / 10000;
            uint256 amount = trackNoShares[msg.sender][_trackID] * noRate;
            amount += credits;
            return amount;        
        }
    }

    function withdraw(uint256 _eventID) 
    public marketEnded returns (bool) {
        require(yesT == _eventID || noT == _eventID, "Can't withdraw");
        if (yesT == _eventID) {
            require(trackYesShares[msg.sender][_eventID] != 0, "YES shares not left!");
            uint256 shares = trackYesShares[msg.sender][_eventID];
            uint256 credits = (trackCredits[msg.sender][_eventID] * yesVolRatio) / 10000;
            uint256 amount = trackYesShares[msg.sender][_eventID] * yesRate;
            amount += credits;
            // Reducing the shares   
            trackCredits[msg.sender][_eventID] = 0;         
            trackYesShares[msg.sender][_eventID] = 0;
            // tracks[_eventID].volume -= amount;
            // totalVolume -= amount;
            tracks[_eventID].yesShares -= shares;
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "Failed to withdraw");
            return success;
        } else {
            require(trackNoShares[msg.sender][_eventID] != 0, "NO shares not left!");
            uint256 shares = trackNoShares[msg.sender][_eventID];
            uint256 credits = (trackCredits[msg.sender][_eventID] * noVolRatio) / 10000;
            uint256 amount = trackNoShares[msg.sender][_eventID] * noRate;
            amount += credits;
            // Reducing the shares            
            trackCredits[msg.sender][_eventID] = 0;
            trackNoShares[msg.sender][_eventID] = 0;
            // tracks[_eventID].volume -= amount;
            // totalVolume -= amount;
            tracks[_eventID].noShares -= shares;
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "Failed to withdraw");
            return success;        
        }
    }

    function noTrack() internal marketEnded {
        uint256 max = 1;
        if (1 == yesT) {max = 2;}
        for (uint256 i = max; i < tracks.length; i++) {
            if (i == yesT) continue;
            if (tracks[i].probability > tracks[max].probability) {
                max = i;
            }
        }
        noT = max;
    }

    function settingRates() internal marketEnded {
        yesVolRatio = (tracks[yesT].volume * 1e4) / (tracks[yesT].volume + tracks[noT].volume);
        uint256 yesVal = (tracks[yesT].volume) / (tracks[yesT].yesShares);
        yesRate = (yesVal * yesVolRatio) / 10000;
        noVolRatio = (tracks[noT].volume * 1e4) / (tracks[yesT].volume + tracks[noT].volume);
        uint256 noVal = (tracks[noT].volume) / (tracks[noT].noShares);
        noRate = (noVal * noVolRatio) / 10000;
    }

// Market resolution pack
    // Single Track _eventID 0,1
    // Multitrack Track _eventID 1,...,n
    function resolveMarket() public {
        uint256 _eventID = 2;
        require(block.timestamp >= deadline, "Deadline not hit");
        marketResolved = true;

        if (tracks.length == 2) {
            if (_eventID == 1) {
                yesT = 1;
            } else {
                noT = 1;
            }
        } else {
            yesT = _eventID;
            noTrack();
            settingRates();
        }
    }
}