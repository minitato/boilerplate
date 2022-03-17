import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { IUsersPort } from 'application/ports/out/IUsersPort';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { setEnvironment } from 'infrastructure/environments';
import { PostsModule } from 'adapter/configurations/ioc/posts.module';
import { User } from 'domain/User';
// import { User } from 'domain/models/User';

describe('Users', () => {
  let app: INestApplication;
  let usersPort: IUsersPort;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PostsModule,
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

  it(`/POST users/:userId/posts`, async () => {
    await usersPort.save(new User('John Doe', 'john.doe@gmail.com'));

    const { body } = await request(app.getHttpServer())
      .post('/users/1/posts')
      .send({ title: 'Title', text: 'Text' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);

    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();

    expect(body).toEqual({
      id: body.id,
      title: 'Title',
      text: 'Text',
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    });
  });

  it(`/GET users/:userId/posts`, async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/1/posts')
      .expect(HttpStatus.OK);

    expect(body).toHaveLength(1);
    expect(body[0].id).toBeTruthy();
    expect(body[0].createdAt).toBeTruthy();
    expect(body[0].updatedAt).toBeTruthy();

    expect(body).toEqual([
      {
        id: body[0].id,
        title: 'Title',
        text: 'Text',
        createdAt: body[0].createdAt,
        updatedAt: body[0].updatedAt,
      },
    ]);
  });

  it(`/GET users/:userId/posts/:postId`, async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/1/posts/1')
      .expect(HttpStatus.OK);

    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();

    expect(body).toEqual({
      id: body.id,
      title: 'Title',
      text: 'Text',
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    });
  });

  afterAll(async () => {
    await usersPort.query(`DELETE FROM posts;`);
    await usersPort.query(`DELETE FROM users;`);
    await usersPort.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);
    await usersPort.query(`ALTER SEQUENCE posts_id_seq RESTART WITH 1;`);
    await app.close();
  });
});
