import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isEqual, sortBy } from 'lodash';
import { forkJoin, from as fromPromise, Observable, of } from 'rxjs';
import { isFunction } from '@nestjs/common/utils/shared.utils';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RpcException } from './exception/jsonrpc.exception';
import { RpcInvalidRequestException } from './exception/rpc.invalid.request.exception';
import { RpcMethodNotFoundException } from './exception/rpc.method.not.found.exception';
import {
  JsonRpcConfig,
  RpcErrorInterface,
  RpcRequestInterface,
  RpcResultInterface,
} from './interfaces';
import { ProxyCallback, ResponseBatch, RpcRequest, RpcResponse } from './types';
import { logger } from '@tuodan/logger';

type TRequest = any;
type TResponse = any;
export const RPC_REGISTERED_MESSAGE = (path: string) =>
  `JsonRpcModule {${path}}`;

@Injectable()
export class JsonRpcServer {
  private needKeys = ['jsonrpc', 'method', 'id'];
  private ignoreKeys = ['params'];
  private handlers: Map<string, ProxyCallback>;

  constructor(private httpAdapterHost: HttpAdapterHost) {}

  public run(handlers: Map<string, ProxyCallback>, config: JsonRpcConfig) {
    this.handlers = handlers;
    logger.info(RPC_REGISTERED_MESSAGE(config.path));
    this.httpAdapterHost.httpAdapter.post(
      config.path,
      this.onRequest.bind(this),
    );
  }

  private onRequest(request: TRequest, response: TResponse, next: () => void) {
    if (Array.isArray(request.body)) {
      this.batchRequest(request, response, next);
      return;
    }

    this.lifecycle(request, response, next).subscribe((result) => {
      this.sendResponse(response, request.body.id ? result : undefined);
    });
  }

  private batchRequest(
    request: TRequest,
    response: TResponse,
    next: () => void,
  ) {
    const batch = request.body as RpcRequestInterface[];
    if (batch.length === 0) {
      this.sendResponse(
        response,
        this.wrapRPCError({}, new RpcInvalidRequestException()),
      );

      return;
    }

    const requests = batch.map((body) => {
      return this.lifecycle({ ...request, body }, response, next);
    });

    forkJoin([...requests]).subscribe((results: ResponseBatch) => {
      const responses = results.filter((result) => {
        return result && result.id !== undefined;
      });
      this.sendResponse(
        response,
        responses.length === 0 ? undefined : responses,
      );
    });
  }

  private sendResponse(response: any, result?: RpcResponse) {
    this.httpAdapterHost.httpAdapter.setHeader(
      response,
      'Content-Type',
      'application/json',
    );
    this.httpAdapterHost.httpAdapter.reply(
      response,
      JSON.stringify(result),
      HttpStatus.OK,
    );
  }

  private lifecycle(
    request: TRequest,
    response: TResponse,
    next: () => void,
  ): Observable<RpcResponse> {
    return of<RpcRequestInterface>(request.body as RpcRequestInterface).pipe(
      tap((body) => this.assertRPCStructure(body)),
      tap((body) => {
        if (this.handlers.has(body.method) === false) {
          throw new RpcMethodNotFoundException();
        }
      }),
      switchMap((body) =>
        this.resolveWaitingResponse(body, request, response, next),
      ),
      catchError((err) => of(err)),
      map((result) =>
        this.resolveResponseOrNullIfNotification(result, request.body),
      ),
    );
  }

  private resolveResponseOrNullIfNotification(
    result: any,
    body: RpcRequestInterface,
  ) {
    if (
      result instanceof RpcException === false &&
      result instanceof Error === false &&
      body.id
    ) {
      return this.wrapRPCResponse(body, result);
    }
    if (result instanceof RpcInvalidRequestException) {
      logger.error(result);
      return this.wrapRPCError(body, result);
    }

    if (body.id === undefined) {
      return null;
    }
    logger.error(result);
    if (result instanceof RpcException) {
      return this.wrapRPCError(body, result);
    }
    if (result instanceof Error) {
      return this.wrapRPCError(body, new RpcException(result.message));
    }
  }

  private resolveWaitingResponse(
    body: RpcRequestInterface,
    request: TRequest,
    response: TResponse,
    next: () => void,
  ) {
    const { method, id } = body;
    if (id === undefined) {
      this.handlers.get(method)(request, response, next);
      return of(null);
    }
    const result = this.handlers.get(method)(request, response, next);
    if (result instanceof Promise) {
      return fromPromise(result);
    }

    if (!this.isObservable(result)) {
      return of(result);
    }

    return result;
  }

  private isObservable(input: unknown): input is Observable<any> {
    return input && isFunction((input as Observable<any>).subscribe);
  }

  private wrapRPCResponse(
    { jsonrpc, id, method }: RpcRequestInterface,
    result = null,
  ): RpcResultInterface {
    return {
      jsonrpc,
      result,
      ...(id && { id, result }),
      ...(id === undefined && { method }),
    };
  }

  private wrapRPCError(
    { jsonrpc = '2.0', method, id }: Partial<RpcRequestInterface>,
    error: RpcException,
  ): RpcErrorInterface {
    return {
      jsonrpc,
      error,
      ...(id === undefined && { method, id: null }),
      ...(id && { id }),
    };
  }

  private assertRPCStructure(body: RpcRequest): RpcRequest {
    if (Array.isArray(body)) {
      for (const operation of body) {
        this.assertStructure(operation);
      }
    } else {
      this.assertStructure(body);
    }

    return body;
  }

  private assertStructure(operation: RpcRequestInterface) {
    const keys = Object.keys(operation).filter((key) => {
      return this.ignoreKeys.includes(key) === false;
    });
    const isValidStructure =
      isEqual(sortBy(this.needKeys), sortBy(keys)) &&
      this.isValidIdType(operation.id) &&
      typeof operation.method === 'string';

    if (isValidStructure) {
      return;
    }
    throw new RpcInvalidRequestException();
  }

  private isValidIdType(id: number | string): boolean {
    if (!id) {
      return false;
    }
    const type = typeof id;
    if (type === 'number' && Number.isInteger(id)) {
      return true;
    }
    return type === 'string';
  }
}
