import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) { }

    async create(createEventDto: CreateEventDto): Promise<Event> {
        return this.eventModel.create(createEventDto);
    }

    async findAll(): Promise<Event[]> {
        return this.eventModel.find({ status: EventStatus.PUBLISHED }).exec();
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventModel.findById(id).exec();
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
        const updatedEvent = await this.eventModel
            .findByIdAndUpdate(id, updateEventDto, { new: true })
            .exec();
        if (!updatedEvent) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return updatedEvent;
    }

    async publish(id: string): Promise<Event> {
        const publishedEvent = await this.eventModel
            .findByIdAndUpdate(id, { status: EventStatus.PUBLISHED }, { new: true })
            .exec();
        if (!publishedEvent) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return publishedEvent;
    }

    async cancel(id: string): Promise<Event> {
        const cancelledEvent = await this.eventModel
            .findByIdAndUpdate(id, { status: EventStatus.CANCELED }, { new: true })
            .exec();
        if (!cancelledEvent) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return cancelledEvent;
    }
}
