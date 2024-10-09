# NestJS Wallet Balances API Using Multicall Contracts

Provides an API to retrieve the balances of specified ERC20 tokens for a given wallet address across different blockchain networks.

- Ethereum Mainnet: 1
- Polygon Mainnet: 137
- Arbitrum Mainnet: 42161
- ...

## Well-Known Multicall Contracts

https://etherscan.io/address/0x5e227AD1969Ea493B43F840cfF78d08a6fc17796

https://polygonscan.com/address/0x275617327c958bD06b5D6b871E7f491D76113dd8

https://arbiscan.io/address/0x842eC2c7D803033Edf55E478F461FC547Bc54EB2

## Installation

1. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

2. Create a `.env` file in the project root directory and add the RPC URLs for different chains:
   ```
   RPC_URLS='{"1": "__YOUR_RPC_URL_1__", "137": "__YOUR_RPC_URL_2__", ...}'
   MULTICALL_ADDRESSES='{"1": "__MULTICALL_ADDRESS_1__", "137": "__MULTICALL_ADDRESS_1__", ...}'
   ```

## Running the Application

1. Start the NestJS server:
   ```sh
   npm run start
   # or
   yarn start
   ```

2. The application will be running on `http://localhost:3000/` by default.

## Usage

The endpoint `/wallet/balances` accepts a POST request to retrieve token balances for a given wallet address.

### Sample cURL Request

```sh
curl -X POST http://localhost:3000/wallet/balances \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x8f0d024e780b7e2fd633a4d6d43631a96e8cb059",
    "tokenAddresses": [
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ],
    "chainID": 1
  }'
```

### Example Response

```json
[
    {
        "token": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "balance": "147987801354"
    },
    {
        "token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "balance": "55072662010"
    }
]
```
