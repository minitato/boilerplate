import { Injectable } from '@nestjs/common';

import { User } from 'domain/User';

import { IRepository } from '../shared/IRepository';

@Injectable()
export abstract class IUsersPort extends IRepository<User> {}
