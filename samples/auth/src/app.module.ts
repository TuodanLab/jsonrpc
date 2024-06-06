import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { JsonRpcModule } from '@tuodan/jsonrpc';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SignInHandler } from './sign-in.handler';
import { SecureHandler } from './secure.handler';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JsonRpcModule.forRoot({
      path: '/rpc',
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [],
  providers: [AppService, SignInHandler, SecureHandler, JwtStrategy],
})
export class AppModule {}
