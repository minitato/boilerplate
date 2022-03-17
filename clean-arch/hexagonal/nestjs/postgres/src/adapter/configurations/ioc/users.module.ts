import { Module } from '@nestjs/common';

import { IUsersPort } from 'application/ports/out/IUsersPort';
import { UsersUseCases } from 'application/service/UsersUseCases';
import { UsersRepository } from 'adapter/out/persistence/database/repositories/UsersRepository';
import { UsersController } from 'adapter/in/web/UsersController';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersUseCases,
    { provide: IUsersPort, useClass: UsersRepository },
  ],
})
export class UsersModule {}
