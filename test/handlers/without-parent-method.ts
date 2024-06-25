import {
  Rpc,
  RpcId,
  RpcMethod,
  RpcPackage,
  RpcPayload,
  RpcVersion,
} from '../../src';

@RpcPackage()
export class WithoutParentMethod {
  @Rpc('withoutParentMethod')
  public async subMethod(
    @RpcPayload() payload: any,
    @RpcVersion() version: string,
    @RpcMethod() method: string,
    @RpcId() id: any,
  ) {
    return 'withoutParentMethod';
  }
}
