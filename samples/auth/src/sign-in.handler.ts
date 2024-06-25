import {
  IRpcHandler,
  RpcPayload,
  RpcVersion,
  RpcId,
  RpcMethod,
  RpcPackage,
  Rpc,
} from '@tuodan/jsonrpc';
import { users } from './users';
import { NotFoundException } from '@nestjs/common';

@RpcPackage({ namespace: 'signin' })
export class SignInHandler implements IRpcHandler<any> {
  constructor() {}

  @Rpc('invoke')
  async invoke(
    @RpcPayload() payload: any,
    @RpcVersion() version: string,
    @RpcId() id: number | string,
    @RpcMethod() method: string,
  ) {
    const user = users.find(({ login, password }) => {
      return login === payload.login && password === payload.password;
    });

    if (user === undefined) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        version,
        method,
      },
    };
  }
}
