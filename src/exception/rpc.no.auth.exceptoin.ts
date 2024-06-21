import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';
import { RpcException } from './jsonrpc.exception';

export class RpcNoAuthException extends RpcException {
  constructor(message: string = 'Authentication required') {
    super(message, JSON_RPC_ERROR_CODES.UNAUTH_ERROR);
  }
}
