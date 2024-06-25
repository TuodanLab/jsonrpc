import { AppService } from './app.service';
import { IRpcHandler, RpcPackage } from '@tuodan/jsonrpc';

@RpcPackage({ namespace: 'hello' })
export class HelloHandler implements IRpcHandler<any> {
  constructor(private readonly appService: AppService) {}

  async invoke() {
    return await this.appService.getHello();
  }
}
