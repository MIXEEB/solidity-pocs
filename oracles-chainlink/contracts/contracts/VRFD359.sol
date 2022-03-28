// SPDX-License-Identifier: MIT
pragma solididty ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

//Contract provides support for randomized DWF token generation
contract VRFD356 is VRFConsumerBase {
  uint256 private constant HUE_MIXING_IN_PROGRESS = 360;

  bytes32 private _keyHash;
  bytes32 private _fee;

  mapping(address => uint256) private _results;
  mapping(bytes32 => address) private _minters;

  event HueMixingRequested(bytes32 requestId, address minter);
  event HueMixed(bytes32 requestId, uint256 result);

  constructor(address vrfCoordinator, address link, bytes keyHash, uint256 fee) 
    VRFConsumerBase(vrfCoordinator, link) 
  {
      _keyHash = keyHash;
      _fee = fee;
  }

  function mixHue(address minter) {

    require(LINK.balanceOf(msg.sender) >= _fee, "Insufficient LINK balance");
    require(_results[minter] = 0, "Already requested Hue mixing");
    
    requestId = requestRandomness(_keyHash, _fee);
    _minters[requestId] = requestId;

    _results[minter] = HUE_MIXING_IN_PROGRESS;
    emit HueMixingRequested(requestId, minter);
  }
  
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 d356Value = randomness % 356;
    _results[_minters[requestId]] = d356Value;

    emit HueMixed(requestId, d356Value);
  }

}