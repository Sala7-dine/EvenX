import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reservation, ReservationStatus } from './schemas/reservation.schema';
import { EventsService } from '../events/events.service';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let model: any;
  let eventsService: any;

  const mockReservation = {
    _id: 'resId',
    eventId: 'eventId',
    userId: 'userId',
    status: ReservationStatus.PENDING,
    save: jest.fn(),
  };

  class MockReservationModel {
    constructor(public data: any) {
      Object.assign(this, data);
    }
    save = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ ...this.data, _id: 'resId' }),
      );
    static find = jest.fn();
    static findById = jest.fn();
    static findOne = jest.fn();
    static countDocuments = jest.fn();
  }

  const mockEventsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(Reservation.name),
          useValue: MockReservationModel,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    model = module.get(getModelToken(Reservation.name));
    eventsService = module.get(EventsService);
  });

  describe('create', () => {
    it('should create reservation if event exists and has capacity', async () => {
      // Mock event found
      eventsService.findOne.mockResolvedValue({ _id: 'eventId', capacity: 10 });
      // Mock count < capacity
      jest.spyOn(MockReservationModel, 'countDocuments').mockResolvedValue(5);
      // Mock no existing reservation
      jest.spyOn(MockReservationModel, 'findOne').mockResolvedValue(null);

      const dto = { eventId: 'eventId' };
      const result = await service.create(dto, 'userId');

      expect(result.status).toEqual(ReservationStatus.PENDING);
      expect(result.userId).toEqual('userId');
    });

    it('should throw NotFoundException if event does not exist', async () => {
      eventsService.findOne.mockResolvedValue(null);
      await expect(
        service.create({ eventId: 'invalid' }, 'user'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if event is full', async () => {
      eventsService.findOne.mockResolvedValue({ _id: 'eventId', capacity: 10 });
      jest.spyOn(MockReservationModel, 'countDocuments').mockResolvedValue(10);
      jest.spyOn(MockReservationModel, 'findOne').mockResolvedValue(null);

      await expect(
        service.create({ eventId: 'eventId' }, 'user'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirm', () => {
    it('should confirm reservation', async () => {
      const res = {
        ...mockReservation,
        status: ReservationStatus.PENDING,
        save: jest.fn().mockResolvedValue({
          ...mockReservation,
          status: ReservationStatus.CONFIRMED,
        }),
      };
      jest.spyOn(MockReservationModel, 'findById').mockResolvedValue(res);

      const result = await service.confirm('resId');
      expect(res.status).toEqual(ReservationStatus.CONFIRMED);
    });
  });

  describe('cancel', () => {
    it('should cancel logic test (admin)', async () => {
      const res = { ...mockReservation, userId: 'otherUser', save: jest.fn() };
      jest.spyOn(MockReservationModel, 'findById').mockResolvedValue(res);

      // calling without second arg implies admin
      await service.cancel('resId');
      expect(res.status).toEqual(ReservationStatus.CANCELED);
    });

    it('should forbid participant cancelling others reservation', async () => {
      const res = {
        ...mockReservation,
        userId: 'otherUser',
        toString: () => 'otherUser',
      };
      // fix toString logic relative to how service checks: reservation.userId.toString()
      // Mock simple structure
      const mockResObj = {
        userId: 'otherUser',
        status: 'PENDING',
        save: jest.fn(),
      };
      jest
        .spyOn(MockReservationModel, 'findById')
        .mockResolvedValue(mockResObj);

      await expect(service.cancel('resId', 'myUser')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
