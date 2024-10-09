import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { ethers, getAddress } from 'ethers';
import * as ERC20_ABI from '../assets/ERC20_ABI.json';
import * as MULTICALL_ABI from '../assets/MULTICALL_ABI.json';

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

        /*
            const balances = [];
            await Promise.all(
                tokenAddresses.map(async tokenAddress => {
                    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
                    const balance = await contract.balanceOf(walletAddress);
                    balances.push({ token: tokenAddress, balance: balance.toString() });
                })
            )
            return balances;
        */

        const multicallAddresses = JSON.parse(this.configService.get<string>('MULTICALL_ADDRESSES'));
        let multicallAddress = multicallAddresses[chainID];

        if (!multicallAddress) {
            throw new Error(`Multicall contract address not found for chainID ${chainID}`);
        }

        try {
            // Ensure that the multicall address has the correct checksum
            multicallAddress = getAddress(multicallAddress);
        } catch (error) {
            throw new Error(`Invalid multicall address for chainID ${chainID}: ${error.message}`);
        }

        const multicallContract = new ethers.Contract(multicallAddress, MULTICALL_ABI, provider);

        // Prepare the calls for each token balanceOf function
        const calls = tokenAddresses.map((tokenAddress) => ({
            target: getAddress(tokenAddress), // Ensure token address has the correct checksum
            callData: new ethers.Interface(ERC20_ABI).encodeFunctionData("balanceOf", [walletAddress]),
        }));

        // Make the multicall
        const [, returnData] = await multicallContract.aggregate(calls);

        // Decode the return data using ethers ABI coder
        const iface = new ethers.Interface(ERC20_ABI);
        const balances = returnData.map((data, index) => {
            const [balance] = iface.decodeFunctionResult("balanceOf", data);
            return { token: tokenAddresses[index], balance: balance.toString() };
        });

        return balances;
    }
}
