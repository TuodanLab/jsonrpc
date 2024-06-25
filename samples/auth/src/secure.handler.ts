import { IRpcHandler, RpcPackage } from '@tuodan/jsonrpc';
import { UseGuards } from '@nestjs/common';
import { RPCGuard } from './rpc.guard';

@RpcPackage({ namespace: 'secure' })
export class SecureHandler implements IRpcHandler<any> {
  @UseGuards(RPCGuard)
  async invoke() {
    return 'secure';
  }
}
