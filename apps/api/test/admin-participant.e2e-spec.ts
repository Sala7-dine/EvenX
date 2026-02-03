import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

// Use a unique suffix for this test run to avoid collisions if DB is persistent
const SUFFIX = Date.now();
const ADMIN = {
    email: `admin_e2e_${SUFFIX}@example.com`,
    password: 'Password123!',
    name: 'Admin E2E',
    role: 'ADMIN',
};
const PARTICIPANT = {
    email: `participant_e2e_${SUFFIX}@example.com`,
    password: 'Password123!',
    name: 'Participant E2E',
    role: 'PARTICIPANT',
};

describe('Admin <-> Participant Flow (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let participantToken: string;
    let eventId: string;
    let reservationId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('1. Authentication', () => {
        it('Should register and login Admin', async () => {
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(ADMIN)
                .expect(201);

            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: ADMIN.email, password: ADMIN.password })
                .expect(201); // or 200 depending on implementation

            expect(res.body.access_token).toBeDefined();
            adminToken = res.body.access_token;
        });

        it('Should register and login Participant', async () => {
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(PARTICIPANT)
                .expect(201);

            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: PARTICIPANT.email, password: PARTICIPANT.password })
                .expect(201); // or 200

            expect(res.body.access_token).toBeDefined();
            participantToken = res.body.access_token;
        });
    });

    describe('2. Event Management (Admin)', () => {
        it('Should create an event', async () => {
            const res = await request(app.getHttpServer())
                .post('/events')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'E2E Test Event',
                    description: 'Description',
                    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                    location: 'Internet',
                    capacity: 50
                })
                .expect(201);

            expect(res.body._id).toBeDefined();
            eventId = res.body._id;
        });

        it('Should publish the event', async () => {
            await request(app.getHttpServer())
                .patch(`/events/${eventId}/publish`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });

    describe('3. Reservation (Participant)', () => {
        it('Should create a reservation', async () => {
            const res = await request(app.getHttpServer())
                .post('/reservations')
                .set('Authorization', `Bearer ${participantToken}`)
                .send({ eventId })
                .expect(201);

            expect(res.body._id).toBeDefined();
            expect(res.body.status).toBe('PENDING');
            reservationId = res.body._id;
        });

        it('Should verify reservation is pending in "My Reservations"', async () => {
            const res = await request(app.getHttpServer())
                .get('/reservations/me')
                .set('Authorization', `Bearer ${participantToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            const myRes = res.body.find(r => r._id === reservationId);
            expect(myRes).toBeDefined();
            expect(myRes.status).toBe('PENDING');
        });

        it('Should NOT allow ticket download for pending reservation', async () => {
            await request(app.getHttpServer())
                .get(`/reservations/${reservationId}/ticket`)
                .set('Authorization', `Bearer ${participantToken}`)
                .expect(400); // Ticket not available
        });
    });

    describe('4. Confirmation & Ticket (Admin & Participant)', () => {
        it('Should confirm reservation (Admin)', async () => {
            await request(app.getHttpServer())
                .patch(`/reservations/${reservationId}/confirm`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });

        it('Should allow ticket download (Participant)', async () => {
            const res = await request(app.getHttpServer())
                .get(`/reservations/${reservationId}/ticket`)
                .set('Authorization', `Bearer ${participantToken}`)
                .expect(200);

            expect(res.header['content-type']).toContain('application/pdf');
        });
    });
});
