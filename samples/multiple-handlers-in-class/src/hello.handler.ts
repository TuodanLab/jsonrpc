import { AppService } from './app.service';
import { RpcMethodHandler, RpcHandler } from '@tuodan/jsonrpc';

@RpcHandler({ method: 'prefix' })
export class HelloHandler {
  constructor(private readonly appService: AppService) {}

  @RpcMethodHandler('add')
  public add(): string {
    return this.appService.getHello();
  }

  @RpcMethodHandler('delete')
  public delete(): string {
    return this.appService.getHello();
  }
}
