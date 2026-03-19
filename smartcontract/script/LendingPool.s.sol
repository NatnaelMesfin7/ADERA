// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AderaLendingPool.sol";
import "../src/interfaces/ICreditScore.sol";

contract DeployLendingPool is Script {
    function run() external returns (address) {
        // Provide addresses via env vars:
        // CREDIT_SCORE (address of deployed CreditScore)
        // PRICE_ORACLE  (address of price oracle to use in production)
        address creditAddr = 0x0D07B8D38Ec70bAb9221aE81aD24A5169973d606;
        address oracleAddr = 0x4b00bAA817186Ad7662662086Cb04b273EABaA31;
        require(
            creditAddr != address(0) && oracleAddr != address(0),
            "set CREDIT_SCORE and PRICE_ORACLE env vars"
        );

        vm.startBroadcast();
        LendingPool pool = new LendingPool(creditAddr, oracleAddr);

        // Wire the lending pool into the credit contract so it can call score updates
        // ICreditScore(creditAddr).setLendingPool(address(pool));
        vm.stopBroadcast();

        console.log("LendingPool deployed at:", address(pool));
        return address(pool);
    }
}
