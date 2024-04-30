// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StaticCounter {
    // Static counter variable
    uint256 private staticCounter;

    // Constructor to initialize the static counter
    constructor() {
        staticCounter = 3;
    }

    // Function to get the current value of the static counter
    function getStaticCounter() public view returns (uint256) {
        return staticCounter;
    }

    // Function to increment the static counter
    function incrementStaticCounter() public {
        staticCounter++;
    }
}
