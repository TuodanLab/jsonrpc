import { JSON_RPC_ERROR_CODES } from './jsonrpc.error.codes';

export class RpcException extends Error {
  public readonly message: any;
  constructor(
    message: string,
    readonly code: number = JSON_RPC_ERROR_CODES.INVALID_REQUEST,
  ) {
    super();
    this.message = message;
    this.code = code;
  }
  public getCode(): number {
    return this.code;
  }
}
