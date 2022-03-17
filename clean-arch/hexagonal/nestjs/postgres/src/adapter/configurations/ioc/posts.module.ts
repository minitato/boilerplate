import { Module } from '@nestjs/common';

import { IUsersPort } from 'application/ports/out/IUsersPort';
import { UsersRepository } from 'adapter/out/persistence/database/repositories/UsersRepository';
import { PostsController } from 'adapter/in/web/PostsController';
import { PostsUseCases } from 'application/service/PostsUseCases';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [
    PostsUseCases,
    { provide: IUsersPort, useClass: UsersRepository },
  ],
})
export class PostsModule {}
