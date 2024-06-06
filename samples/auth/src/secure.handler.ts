import { RpcHandler, IRpcHandler } from '@tuodan/jsonrpc';
import { UseGuards } from '@nestjs/common';
import { RPCGuard } from './rpc.guard';

@RpcPackage({ method: 'secure' })
export class SecureHandler implements IRpcHandler<any> {
  @UseGuards(RPCGuard)
  public invoke() {
    return 'secure';
  }
}
