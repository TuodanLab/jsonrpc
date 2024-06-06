import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';
import { RpcException } from './jsonrpc.exception';

export class RpcParseException extends RpcException {
  constructor(message: string = 'Parse error') {
    super(message, JSON_RPC_ERROR_CODES.PARSE_ERROR);
  }
}
