import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { RedisService } from '../src/moudle/redis/redis.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Database & Redis Connection (e2e)', () => {
  let app: INestApplication;
  let redisService: RedisService;
  let mongoConnection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    redisService = app.get<RedisService>(RedisService);
    mongoConnection = app.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should successfully connect to MongoDB (Mongoose)', () => {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    expect(mongoConnection.readyState).toBe(1);
  });

  it('should successfully connect to Redis', async () => {
    const client = redisService.getClient();
    expect(client).toBeDefined();

    const pingResult = await client.ping();
    expect(pingResult).toBe('PONG');
  });
});
