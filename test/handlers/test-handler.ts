import {
  IRpcHandler,
  RpcId,
  RpcMethod,
  RpcPackage,
  RpcPayload,
  RpcVersion,
} from '../../src';

@RpcPackage({
  namespace: 'test',
})
export class TestHandler implements IRpcHandler<any> {
  public async invoke(
    @RpcPayload() payload: any,
    @RpcVersion() version: string,
    @RpcMethod() method: string,
    @RpcId() id: any,
  ) {
    return payload;
  }
}
