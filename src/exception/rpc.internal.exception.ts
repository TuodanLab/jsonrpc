import { RpcException } from './jsonrpc.exception';
import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';

export class RpcInternalException extends RpcException {
  constructor(message: string = 'Internal error') {
    super(message, JSON_RPC_ERROR_CODES.INTERNAL_ERROR);
  }
}
