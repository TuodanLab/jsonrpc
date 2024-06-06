import {
  RpcHandler,
  RpcId,
  RpcMethod,
  RpcMethodHandler,
  RpcPayload,
  RpcVersion,
} from '../../src';

@RpcPackage({
  method: 'prefix',
})
export class MultipleHandlers {
  @Rpc('subMethod')
  public async subMethod(
    @RpcPayload() payload: any,
    @RpcVersion() version: string,
    @RpcMethod() method: string,
    @RpcId() id: any,
  ) {
    return payload;
  }

  @Rpc('subMethod1')
  public async subMethod1(
    @RpcPayload() payload: any,
    @RpcVersion() version: string,
    @RpcMethod() method: string,
    @RpcId() id: any,
  ) {
    return payload;
  }
}
