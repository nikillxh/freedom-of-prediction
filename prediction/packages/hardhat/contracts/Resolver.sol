// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
/**
 * @title MarketResolver
 * @dev Chainlink Functions contract for resolving prediction markets using AI models
 * Returns the index of the winning track after market deadline
 */
contract MarketResolver is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // Market data
    string public marketName;
    string[] public marketTracks;
    uint256 public deadline;
    uint256 public resultIndex;
    bool public resolved;
    address public marketContract;

    // Chainlink Functions configuration
    address internal router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
    bytes32 internal donId =  0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    uint64 internal subscriptionId = 5204;

    // Request tracking
    mapping(bytes32 => bool) public pendingRequests;

    // Events
    event MarketCreated(string marketName, string[] tracks, uint256 deadline);
    event ResolutionRequested(bytes32 indexed requestId);
    event MarketResolved(uint256 indexed resultIndex, string aiResponse);
    event RequestFailed(bytes32 indexed requestId, bytes error);

    // Errors
    error DeadlineNotReached();
    error AlreadyResolved();
    error OnlyMarketContract();
    error InvalidTrackIndex();
    error UnexpectedRequestID(bytes32 requestId);

    modifier onlyAfterDeadline() {
        if (block.timestamp < deadline) revert DeadlineNotReached();
        _;
    }

    modifier onlyMarketContract() {
        if (msg.sender != marketContract) revert OnlyMarketContract();
        _;
    }

    modifier notResolved() {
        if (resolved) revert AlreadyResolved();
        _;
    }

    // /**
    //  * @dev Initialize the contract with market parameters
    //  * @param _marketName Name of the prediction market
    //  * @param _marketTracks Array of possible outcomes/tracks
    //  * @param _deadline Timestamp when market closes and can be resolved
    //  * @param _marketContract Address of the market contract that can call resolve
    //  * @param _router Chainlink Functions router address
    //  * @param _donId DON ID for Chainlink Functions
    //  * @param _subscriptionId Subscription ID for billing
    //  */
    constructor(
        string memory _marketName,
        string[] memory _marketTracks,
        uint256 _deadline,
        address _marketContract
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        marketName = _marketName;
        marketTracks = _marketTracks;
        deadline = _deadline;
        marketContract = _marketContract;        
        emit MarketCreated(_marketName, _marketTracks, _deadline);
    }

    /**
     * @dev Request market resolution using Chainlink Functions
     * Can only be called by the market contract after deadline
     * @return requestId The ID of the Chainlink Functions request
     */
    function requestResolution() 
        external 
        onlyMarketContract 
        onlyAfterDeadline 
        notResolved
        returns (bytes32 requestId) 
    {
        FunctionsRequest.Request memory req;
        
        // set the source code when calling, not store it
        // req.initializeRequestForInlineJavaScript(yourSourceCode);

        // Create prompt for AI model
        string memory prompt = string(abi.encodePacked(
            "Market: ", marketName, 
            ". Options: ", _joinTracks(), 
            ". Deadline: ", _uint2str(deadline),
            ". Determine the winning option and return only the index number (1-", 
            _uint2str(marketTracks.length), 
            ") of the correct answer."
        ));

        // Set the prompt as argument
        string[] memory args = new string[](1);
        args[0] = prompt;
        req.setArgs(args);

        // Send the request with default gas limit
        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            300000, // Default gas limit
            donId
        );

        pendingRequests[requestId] = true;
        emit ResolutionRequested(requestId);
        
        return requestId;
    }

    /**
     * @dev Callback function for Chainlink Functions response
     * @param requestId The ID of the request
     * @param response The response from the AI model
     * @param err Any error from the request
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (!pendingRequests[requestId]) {
            revert UnexpectedRequestID(requestId);
        }
        
        delete pendingRequests[requestId];

        if (err.length > 0) {
            emit RequestFailed(requestId, err);
            return;
        }

        // Parse the AI response to get track index
        string memory aiResponse = string(response);
        uint256 trackIndex = _parseTrackIndex(aiResponse);
        
        if (trackIndex >= marketTracks.length) revert InvalidTrackIndex();
        
        resultIndex = trackIndex;
        resolved = true;
        
        emit MarketResolved(trackIndex, aiResponse);
    }

    /**
     * @dev Parse the AI response to extract track index
     * @param response The AI model response
     * @return The parsed track index
     */
    function _parseTrackIndex(string memory response) private pure returns (uint256) {
        bytes memory responseBytes = bytes(response);
        uint256 result = 0;
        
        // Extract first number from response
        for (uint256 i = 0; i < responseBytes.length; i++) {
            if (responseBytes[i] >= 0x30 && responseBytes[i] <= 0x39) { // 0-9
                result = result * 10 + (uint256(uint8(responseBytes[i])) - 48);
            } else if (result > 0) {
                break; // Stop at first non-digit after finding digits
            }
        }
        
        return result;
    }

    /**
     * @dev Join market tracks into a comma-separated string
     * @return Concatenated tracks string
     */
    function _joinTracks() private view returns (string memory) {
        if (marketTracks.length == 0) return "";
        
        string memory result = marketTracks[0];
        for (uint256 i = 1; i < marketTracks.length; i++) {
            result = string(abi.encodePacked(result, ", ", marketTracks[i]));
        }
        return result;
    }

    /**
     * @dev Convert uint to string
     * @param _i Integer to convert
     * @return String representation
     */
    function _uint2str(uint256 _i) private pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    /**
     * @dev Get the resolution result
     * @return The index of the winning track
     */
    function getResult() external view returns (uint256) {
        require(resolved, "Market not yet resolved");
        return resultIndex;
    }

    /**
     * @dev Check if market is resolved
     * @return Boolean indicating if market is resolved
     */
    function isResolved() external view returns (bool) {
        return resolved;
    }

    /**
     * @dev Get market tracks
     * @return Array of market tracks
     */
    function getMarketTracks() external view returns (string[] memory) {
        return marketTracks;
    }

    /**
     * @dev Get market info
     * @return name The market name
     * @return tracks Array of possible outcomes
     * @return marketDeadline The deadline timestamp
     * @return isMarketResolved Whether the market is resolved
     */
    function getMarketInfo() 
        external 
        view 
        returns (
            string memory name,
            string[] memory tracks,
            uint256 marketDeadline,
            bool isMarketResolved
        ) 
    {
        return (marketName, marketTracks, deadline, resolved);
    }

    /**
     * @dev Update Functions configuration (only owner)
     * @param _donId New DON ID
     * @param _subscriptionId New subscription ID
     */
    function updateFunctionsConfig(
        bytes32 _donId,
        uint64 _subscriptionId
    ) external onlyOwner {
        donId = _donId;
        subscriptionId = _subscriptionId;
    }
}