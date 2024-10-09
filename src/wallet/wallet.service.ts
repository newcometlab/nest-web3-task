import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as ERC20_ABI from '../assets/ERC20_ABI.json';

@Injectable()
export class WalletService {
    constructor(private configService: ConfigService) { }

    /**
     * @method getTokenBalances
     * @description Fetch balances of token array for a wallet on the specified chain.
     * @param {string} walletAddress Wallet Address to fetch token balances for.
     * @param {string[]} tokenAddresses Array of token contract addresses.
     * @param {number} chainID ChainID of the blockchain network (e.g., ETH, POL, ARB).
     * @returns {Promise<{ token: string; balance: string; }[]>}
     */
    async getTokenBalances(
        walletAddress: string,
        tokenAddresses: string[],
        chainID: number,
    ) {
        const rpcUrls = JSON.parse(this.configService.get<string>('RPC_URLS'));
        const rpcUrl = rpcUrls[chainID];

        if (!rpcUrl) {
            throw new Error(`Invalid chainID ${chainID}`);
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const balances = [];

        await Promise.all(
            tokenAddresses.map(async tokenAddress => {
                const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
                const balance = await contract.balanceOf(walletAddress);
                balances.push({ token: tokenAddress, balance: balance.toString() });
            })
        )

        return balances;
    }
}
