import {
  IRpcHandler,
  Rpc,
  RpcId,
  RpcMethod,
  RpcPackage,
  RpcPayload,
  RpcVersion,
} from '../../src';
import { Header } from '@nestjs/common';

@RpcPackage({ namespace: 'test' })
export class CustomHeaderHandler implements IRpcHandler<any> {
  @Header('Handler-Name', CustomHeaderHandler.name)
  public async invoke(
    @RpcPayload() payload: any,
    @RpcVersion() version: string,
    @RpcMethod() method: string,
    @RpcId() id: any,
  ) {
    return payload;
  }
}
