import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const uniqueUsername = `testuser_${Date.now()}`;
    const uniqueEmail = `test_${Date.now()}@example.com`;

    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: uniqueUsername,
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toBe(uniqueUsername);
          authToken = res.body.access_token;
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: uniqueUsername,
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('/auth/login (POST) - invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: uniqueUsername,
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Customers', () => {
    const testCustomerId = 'TST01';

    it('/customers (GET) - without auth', () => {
      return request(app.getHttpServer())
        .get('/customers')
        .expect(401);
    });

    it('/customers (GET) - with auth', () => {
      return request(app.getHttpServer())
        .get('/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/customers (POST) - create customer', () => {
      return request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerId: testCustomerId,
          companyName: 'Test Company',
          contactName: 'Test Contact',
          city: 'Test City',
          country: 'Test Country',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.customerId).toBe(testCustomerId);
          expect(res.body.companyName).toBe('Test Company');
        });
    });

    it('/customers/:id (GET) - get customer', () => {
      return request(app.getHttpServer())
        .get(`/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.customerId).toBe(testCustomerId);
        });
    });

    it('/customers/:id (PATCH) - update customer', () => {
      return request(app.getHttpServer())
        .patch(`/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          companyName: 'Updated Company',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.companyName).toBe('Updated Company');
        });
    });

    it('/customers/:id (DELETE) - delete customer', () => {
      return request(app.getHttpServer())
        .delete(`/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('/customers/:id (GET) - customer not found', () => {
      return request(app.getHttpServer())
        .get('/customers/INVALID')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
