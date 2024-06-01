// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract Owned {
address public owner;

    constructor(){
        owner = msg.sender;
    }
   
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "only owner can call this function"
        );
        _;
    }
}

