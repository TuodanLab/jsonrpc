import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';
import { RpcException } from './jsonrpc.exception';

export class RpcInvalidParamException extends RpcException {
  constructor(message: string = 'Invalid params') {
    super(message, JSON_RPC_ERROR_CODES.INVALID_PARAMS);
  }
}
