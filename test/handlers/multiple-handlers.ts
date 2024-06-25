import {
  Rpc,
  RpcId,
  RpcMethod,
  RpcPackage,
  RpcPayload,
  RpcVersion,
} from '../../src';

@RpcPackage({
  namespace: 'prefix',
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
