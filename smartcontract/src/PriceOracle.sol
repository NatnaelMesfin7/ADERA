// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPriceOracle.sol";

contract PriceOracle is IPriceOracle {
    /// -----------------------------------------------------------------------
    /// Errors
    /// -----------------------------------------------------------------------
    error NotAdmin();
    error UpdateTooSoon();
    error PriceDeviationTooHigh();
    error InvalidPrice();

    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------
    event PriceUpdated(
        address indexed asset,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 timestamp
    );

    event DecimalsSet(address indexed asset, uint8 decimals);

    /// -----------------------------------------------------------------------
    /// Storage
    /// -----------------------------------------------------------------------

    /// @notice oracle admin (off-chain updater)
    address public admin;

    /// @notice asset => price (scaled, e.g. 1e8)
    mapping(address => uint256) private prices;

    /// @notice asset => last update timestamp
    mapping(address => uint256) private lastUpdated;

    /// @notice asset => decimals for the price
    mapping(address => uint8) private assetDecimals;

    /// @notice maximum allowed deviation in BPS (e.g. 500 = 5%)
    uint256 public maxDeviation;

    /// @notice minimum seconds between updates per asset
    uint256 public minUpdateInterval;

    /// -----------------------------------------------------------------------
    /// Constructor
    /// -----------------------------------------------------------------------
    constructor(
        address _admin,
        uint256 _maxDeviation,
        uint256 _minUpdateInterval
    ) {
        admin = _admin;
        maxDeviation = _maxDeviation;
        minUpdateInterval = _minUpdateInterval;
    }

    /// -----------------------------------------------------------------------
    /// Modifiers
    /// -----------------------------------------------------------------------
    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    /// -----------------------------------------------------------------------
    /// Oracle Read Functions
    /// -----------------------------------------------------------------------

    function getPrice(address asset) external view override returns (uint256) {
        return prices[asset];
    }

    function getLastUpdated(
        address asset
    ) external view override returns (uint256) {
        return lastUpdated[asset];
    }

    function getDecimals(address asset) external view override returns (uint8) {
        return assetDecimals[asset];
    }

    /// -----------------------------------------------------------------------
    /// Admin Functions
    /// -----------------------------------------------------------------------

    function updatePrice(address asset, uint256 newPrice) external onlyAdmin {
        if (newPrice == 0) revert InvalidPrice();

        uint256 oldPrice = prices[asset];
        uint256 lastTime = lastUpdated[asset];

        // Enforce update interval (skip for first update)
        if (lastTime != 0) {
            if (block.timestamp < lastTime + minUpdateInterval) {
                revert UpdateTooSoon();
            }
        }

        // Enforce deviation check (skip for first update)
        if (oldPrice != 0) {
            uint256 diff = newPrice > oldPrice
                ? newPrice - oldPrice
                : oldPrice - newPrice;

            uint256 deviationBps = (diff * 10_000) / oldPrice;

            if (deviationBps > maxDeviation) {
                revert PriceDeviationTooHigh();
            }
        }

        prices[asset] = newPrice;
        lastUpdated[asset] = block.timestamp;

        emit PriceUpdated(asset, oldPrice, newPrice, block.timestamp);
    }

    /// @notice Set decimals for an asset (e.g., price scaled by 1e8 => decimals = 8)
    function setDecimals(address asset, uint8 decimals_) external onlyAdmin {
        assetDecimals[asset] = decimals_;
        emit DecimalsSet(asset, decimals_);
    }
}
