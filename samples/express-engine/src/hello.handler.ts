import { AppService } from './app.service';
import { IRpcHandler, RpcHandler } from '@tuodan/jsonrpc';

@RpcPackage({ method: 'hello' })
export class HelloHandler implements IRpcHandler<any> {
  constructor(private readonly appService: AppService) {}

  public invoke(): string {
    return this.appService.getHello();
  }
}
