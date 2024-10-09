import { Body, Controller, Post } from "@nestjs/common";
import { WalletService } from "./wallet.service";

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    /**
     * @method getBalances
     * @description POST endpoint '/wallet/balances'. Receive wallet address, token addresses, and chain ID to retrieve token balances.
     * @param {BalancesRequestDto} requestBody - Request body containing walletAddress, tokenAddresses, and chainID.
     * @returns {Promise<{ token: string; balance: string; }[]>}
     */
    @Post('balances')
    async getBalances(@Body() requestBody: BalancesRequestDto) {
        return await this.walletService.getTokenBalances(
            requestBody.walletAddress,
            requestBody.tokenAddresses,
            requestBody.chainID,
        );
    }
}
