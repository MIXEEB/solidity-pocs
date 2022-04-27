pragma solidity ^0.8.0;

import './Base';

contract Inherited is Base {

  bytes32 public data;

  constructor (bytes32 _data) public {
    data = _data;
  }

}
