import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController, WalletController],
  providers: [AppService, WalletService],
})
export class AppModule {}
