import { AppService } from './app.service';
import { Rpc, RpcPackage } from '@tuodan/jsonrpc';

@RpcPackage({ namespace: 'prefix' })
export class HelloHandler {
  constructor(private readonly appService: AppService) {}

  @Rpc('add')
  async add() {
    return await this.appService.getHello();
  }

  @Rpc('delete')
  async delete() {
    return await this.appService.getHello();
  }
}
