import { AppService } from './app.service';
import { IRpcHandler, RpcPackage } from '@tuodan/jsonrpc';
import { Logger } from '@nestjs/common';

@RpcPackage({ namespace: 'hello' })
export class HelloHandler implements IRpcHandler<any> {
  constructor(private readonly appService: AppService) {
    Logger.log(`instantiate ${HelloHandler.name} on every request`);
  }

  async invoke() {
    return await this.appService.getHello();
  }
}
