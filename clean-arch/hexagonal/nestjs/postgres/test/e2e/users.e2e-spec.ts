import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { IUsersPort } from 'application/ports/out/IUsersPort';
import { UsersModule } from 'adapter/configurations/ioc/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { setEnvironment } from 'infrastructure/environments';

describe('Users', () => {
  let app: INestApplication;
  let usersPort: IUsersPort;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          envFilePath: setEnvironment(),
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    usersPort = module.get<IUsersPort>(IUsersPort);
  });

  it(`/POST users`, async () => {
    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@gmail.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);

    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();

    expect(body).toEqual({
      id: body.id,
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    });
  });

  it(`/GET users`, async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK);

    expect(body).toHaveLength(1);
    expect(body[0].id).toBeTruthy();
    expect(body[0].createdAt).toBeTruthy();
    expect(body[0].updatedAt).toBeTruthy();

    expect(body).toEqual([
      {
        id: body[0].id,
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        createdAt: body[0].createdAt,
        updatedAt: body[0].updatedAt,
      },
    ]);
  });

  it(`/GET users/:id`, async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK);

    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();

    expect(body).toEqual({
      id: body.id,
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    });
  });

  afterAll(async () => {
    await usersPort.query(`DELETE FROM users;`);
    await usersPort.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
    await app.close();
  });
});
