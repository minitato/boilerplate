import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { IUsersPort } from 'application/ports/out/IUsersPort';
import { User } from 'domain/User';
import { UserEntity } from 'adapter/out/persistence/database/mapper/UserEntity';

import { BaseRepository } from '../shared/BaseRepository';

@Injectable()
export class UsersRepository extends BaseRepository<User>
  implements IUsersPort {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, UserEntity);
  }
}
