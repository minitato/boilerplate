import { Test } from '@nestjs/testing';

import { IUsersPort } from 'application/ports/out/IUsersPort';
import { PostsUseCases } from 'application/service/PostsUseCases';
import { User } from 'domain/User';
import { NotFoundException } from '@nestjs/common';
import { Post } from 'domain/Post';

describe('PostsUseCases Test', () => {
  let usersPort: IUsersPort;
  let postsUseCases: PostsUseCases;

  const POST = new Post('Title', 'Text', null, 1);
  const POST2 = new Post('Title2', 'Text2', null, 1);
  const USER = new User('John Doe', 'john.doe@gmail.com', [POST], 1);
  const USER2 = new User('John Doe', 'john.doe@gmail.com', [POST, POST2], 1);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsUseCases,
        {
          provide: IUsersPort,
          useFactory: () => ({
            save: jest.fn(() => true),
            findOne: jest.fn(() => true),
            find: jest.fn(() => true),
            update: jest.fn(() => true),
            delete: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    usersPort = module.get<IUsersPort>(IUsersPort);
    postsUseCases = module.get<PostsUseCases>(PostsUseCases);
  });

  it('shoud return a list of posts when the users have the posts in  getAllPostsByUser', async () => {
    jest.spyOn(usersPort, 'findOne').mockImplementation(async () => USER);
    const posts = await postsUseCases.getAllPostsByUser(1);

    expect(posts).toHaveLength(1);
    expect(posts).toStrictEqual([POST]);
  });

  it('shoud return a empty list when user has no post in getAllPostsByUser', async () => {
    const user = new User('', '', null, 1);
    jest.spyOn(usersPort, 'findOne').mockImplementation(async () => user);

    const posts = await postsUseCases.getAllPostsByUser(1);

    expect(posts).toHaveLength(0);
    expect(posts).toStrictEqual([]);
  });

  it('shoud throw NotFoundException when the user is not found in getAllPostsByUser', async () => {
    try {
      jest
        .spyOn(usersPort, 'findOne')
        .mockImplementation(async () => null);
      await postsUseCases.getAllPostsByUser(2);
    } catch (err) {
      expect(err instanceof NotFoundException).toBeTruthy();
      expect(err.message).toBe("The user {2} wasn't found.");
    }
  });

  it('shoud get a post when a valid user has a post in getPostByUser', async () => {
    jest.spyOn(usersPort, 'findOne').mockImplementation(async () => USER);

    const post = await postsUseCases.getPostByUser(1, 1);

    expect(post instanceof Post).toBeTruthy();
    expect(post).toStrictEqual(POST);
  });

  it('shoud throw NotFoundException when not user is found in getPostByUser', async () => {
    try {
      jest
        .spyOn(usersPort, 'findOne')
        .mockImplementation(async () => null);
      await postsUseCases.getPostByUser(2, 1);
    } catch (err) {
      expect(err instanceof NotFoundException).toBeTruthy();
      expect(err.message).toBe("The user {2} wasn't found.");
    }
  });

  it('shoud throw NotFoundException when user there are not post in getPostByUser', async () => {
    try {
      const user = new User('', '', null, 1);
      jest
        .spyOn(usersPort, 'findOne')
        .mockImplementation(async () => user);
      await postsUseCases.getPostByUser(1, 1);
    } catch (err) {
      expect(err instanceof NotFoundException).toBeTruthy();
      expect(err.message).toBe("The post {1} wasn't found.");
    }
  });

  it('shoud throw NotFoundException when the post not exists in getPostByUser', async () => {
    try {
      jest
        .spyOn(usersPort, 'findOne')
        .mockImplementation(async () => USER);
      await postsUseCases.getPostByUser(1, 99);
    } catch (err) {
      expect(err instanceof NotFoundException).toBeTruthy();
      expect(err.message).toBe("The post {99} wasn't found.");
    }
  });

  it('should create a post when user and post is valis in createPost', async () => {
    jest.spyOn(usersPort, 'findOne').mockImplementation(async () => USER);
    jest.spyOn(usersPort, 'save').mockImplementation(async () => USER2);

    const post = await postsUseCases.createPost(1, POST2);

    expect(post instanceof Post).toBeTruthy();
    expect(post).toStrictEqual(POST2);
  });

  it('should throw NotFoundException when the user not exists in createPost', async () => {
    try {
      jest
        .spyOn(usersPort, 'findOne')
        .mockImplementation(async () => null);
      await postsUseCases.createPost(2, POST2);
    } catch (err) {
      expect(err instanceof NotFoundException).toBeTruthy();
      expect(err.message).toBe("The user {2} wasn't found.");
    }
  });
});
