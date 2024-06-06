import { AppService } from './app.service';
import { RpcMethodHandler, RpcHandler } from '@tuodan/jsonrpc';

@RpcPackage({ method: 'prefix' })
export class HelloHandler {
  constructor(private readonly appService: AppService) {}

  @Rpc('add')
  public add(): string {
    return this.appService.getHello();
  }

  @Rpc('delete')
  public delete(): string {
    return this.appService.getHello();
  }
}
