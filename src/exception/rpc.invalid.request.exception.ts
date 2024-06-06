import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';
import { RpcException } from './jsonrpc.exception';

export class RpcInvalidRequestException extends RpcException {
  constructor(message: string = 'Invalid request') {
    super(message, JSON_RPC_ERROR_CODES.INVALID_REQUEST);
  }
}
