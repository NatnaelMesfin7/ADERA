# ADERA Finance

ADERA Finance is a credit-aware decentralized lending and borrowing platform built on Moonbase Alpha. It combines overcollateralized DeFi lending with a behavior-based credit model and an agentic support layer that helps users understand their positions, manage risk, and make better borrowing decisions.

## Overview

Most DeFi lending protocols treat borrowers almost the same. ADERA Finance is designed to be different.

ADERA Finance is a credit-aware lending platform where borrower credit is shaped by user interaction with the protocol, especially how they manage and repay loans over time. Users who repay loans on time build stronger credit. Users who repay late, miss repayments, or manage their positions poorly build weaker credit. This creates a more intelligent borrowing system where responsible behavior matters.

The goal is to make lending fairer, safer, and more useful for the entire lending and borrowing community. Good users are encouraged to maintain healthy repayment habits, while lenders and the protocol benefit from improved risk awareness and healthier loan behavior across the system.

## Credit-Aware Lending

ADERA Finance uses user behavior as a signal for credit quality.

- If a borrower consistently repays loans on time, they build good credit.
- If a borrower fails to repay on time or behaves in a risky way, they build bad credit.
- Credit awareness helps the protocol better understand borrower reliability.
- This approach encourages responsible borrowing instead of treating all users as if they have the same risk level.

This helps the lending and borrowing ecosystem in several ways:

- It rewards users who act responsibly.
- It creates better incentives for timely repayment.
- It improves risk management inside the protocol.
- It supports healthier borrowing behavior and reduces avoidable liquidation pressure.
- It gives the community a lending experience that is more adaptive and more informative than standard one-size-fits-all DeFi models.

## Agentic Platform

ADERA Finance is also an agentic platform. This means the protocol is not only a lending application, but also an active assistant that helps users operate inside the platform.

The platform includes an AI agent inside the app that can help users with:

- token information
- supplied and borrowed positions
- supported assets
- borrowing flow
- credit-aware APR explanations
- loan health and liquidation guidance
- general in-app protocol help

The AI agent works with the user's app context, including wallet-connected token and loan data inside the interface, so it can give guidance that is more relevant to the user's actual position. It does not just provide static documentation. It helps users understand what they hold, what they owe, and what actions may improve safety.

ADERA Finance also extends this agentic behavior beyond the interface:

- it monitors loan health
- it sends notifications and guidance by email
- it warns users when positions are becoming risky
- it helps users react before a position becomes critical

This makes ADERA Finance a proactive lending experience rather than a passive dashboard.

## Why ADERA Finance Matters

ADERA Finance is designed to support both borrowers and the wider lending community.

For borrowers, it offers:

- clearer risk visibility
- better guidance inside the app
- behavior-based credit awareness
- proactive alerts instead of last-minute surprises

For the broader lending ecosystem, it offers:

- stronger repayment incentives
- improved risk signaling
- healthier user behavior over time
- a more intelligent and supportive DeFi lending model

## Deployment

- Network: Moonbase Alpha
- Lending Pool Contract: `0xd5bFB51EA7DD1FC2da94b34ee5E3716337a1074d`

## Repository Structure

### `frontend/`

The frontend contains the user-facing web application. This is where users connect their wallets, view supplied and borrowed assets, interact with the lending dashboard, use the in-app AI assistant, and read product information.

Important areas include:

- `frontend/app/` - Next.js app routes, pages, global styling, and UI components
- `frontend/app/components/` - layout, lending, marketing, wallet, and reusable interface pieces
- `frontend/src/` - configuration, hooks, contexts, contract bindings, helpers, providers, and shared types

### `backend/`

The backend contains the off-chain services that support monitoring, AI responses, borrower registration, and email notifications.

Important areas include:

- `backend/src/index.ts` - backend entry point
- `backend/src/routes/` - API routes for borrower registration and AI requests
- `backend/src/services/` - AI request handling, email delivery, and loan monitoring logic
- `backend/src/models/` - database models
- `backend/src/config/` - blockchain and database configuration

### `smartcontract/`

The smartcontract folder contains the on-chain protocol logic and Foundry project files for deployment, testing, and contract development.

Important areas include:

- `smartcontract/src/` - Solidity contracts such as the lending pool, credit score logic, lend token, oracle, and interfaces
- `smartcontract/script/` - deployment and execution scripts
- `smartcontract/test/` - contract tests
- `smartcontract/out/` - compiled artifacts
- `smartcontract/broadcast/` - broadcast and deployment outputs
- `smartcontract/lib/` - external dependencies used by Foundry

## Core Contracts

The smart contract system includes:

- `AderaLendingPool.sol` - the main lending pool contract
- `CreditScore.sol` - the contract responsible for credit-related logic
- `PriceOracle.sol` - oracle support for pricing
- `LendToken.sol` - tokenized representation used in the lending flow

## Summary

ADERA Finance is a Moonbase Alpha credit-aware lending platform that rewards responsible borrowing behavior and gives users an agentic support experience. By combining smart contracts, behavior-based credit awareness, AI guidance, and proactive notifications, ADERA Finance aims to make DeFi lending more intelligent, more transparent, and more helpful for real users.
