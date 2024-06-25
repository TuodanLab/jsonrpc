import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  constructor() {
    Logger.log(`instantiate ${AppService.name} on every request`);
  }
  async getHello() {
    return 'Hello World!';
  }
}
