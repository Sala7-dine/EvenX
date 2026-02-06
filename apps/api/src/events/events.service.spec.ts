import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let model: any;

  const mockEvent = {
    _id: 'eventId',
    title: 'Test Event',
    description: 'Desc',
    date: new Date(),
    location: 'Loc',
    capacity: 100,
    status: 'PUBLISHED',
    save: jest.fn(),
  };

  class MockEventModel {
    constructor(public data: any) {
      return Object.assign(this, data);
    }
    save = jest.fn().mockResolvedValue({ ...this.data, _id: 'eventId' });
    static find = jest.fn();
    static findOne = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
    static create = jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        ...dto,
        _id: 'eventId',
      }),
    );
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: MockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    model = module.get(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const dto = {
        title: 'New Event',
        description: 'Desc',
        date: '2025-01-01',
        location: 'Loc',
        capacity: 10,
      };
      const result = await service.create(dto as any);
      expect(result).toHaveProperty('_id');
      expect(result.title).toEqual(dto.title);
    });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      jest.spyOn(MockEventModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockEvent]),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('findOne', () => {
    it('should return a specific event', async () => {
      jest.spyOn(MockEventModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvent),
      } as any);

      const result = await service.findOne('eventId');
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(MockEventModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('invalidId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Note: update and remove typically follow similar patterns
});
