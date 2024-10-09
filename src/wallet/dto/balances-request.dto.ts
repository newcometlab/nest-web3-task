// Shape of the request body, containing walletAddress, tokenAddresses, and chainID
interface BalancesRequestDto {
    walletAddress: string;
    tokenAddresses: string[];
    chainID: number;
}
