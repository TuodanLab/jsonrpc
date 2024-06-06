import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';
import { RpcException } from './jsonrpc.exception';

export class RpcMethodNotFoundException extends RpcException {
  constructor(message: string = 'Method not found') {
    super(message, JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND);
  }
}
