// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {PriceOracle} from "../src/PriceOracle.sol";

contract DeployPriceOracle is Script {
    function run() external {
        vm.startBroadcast();

        // Configuration
        address admin = msg.sender;
        uint256 maxDeviation = 5000; // 50%
        uint256 minUpdateInterval = 300; // 5 min

        new PriceOracle(admin, maxDeviation, minUpdateInterval);

        vm.stopBroadcast();
    }
}
