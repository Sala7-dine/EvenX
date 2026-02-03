import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationStatus } from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
        private eventsService: EventsService,
    ) { }

    async create(createReservationDto: CreateReservationDto, userId: string) {
        const { eventId } = createReservationDto;

        // 1. Verify Event existence
        const event = await this.eventsService.findOne(eventId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // 2. Check Event capacity
        const activeReservationsCount = await this.reservationModel.countDocuments({
            eventId: eventId as any,
            status: { $ne: ReservationStatus.CANCELED },
        });

        if (activeReservationsCount >= event.capacity) {
            throw new BadRequestException('Event is fully booked');
        }

        // 3. Create Reservation
        const newReservation = new this.reservationModel({
            ...createReservationDto,
            userId,
            status: ReservationStatus.PENDING,
        });

        return newReservation.save();
    }

    async findAll() {
        return this.reservationModel
            .find()
            .populate({ path: 'eventId', select: 'title date location' })
            .populate({ path: 'userId', select: 'name email' })
            .exec();
    }

    async findByUser(userId: string) {
        return this.reservationModel
            .find({ userId: userId as any })
            .populate({ path: 'eventId', select: 'title date location' })
            .exec();
    }

    async confirm(id: string) {
        const reservation = await this.reservationModel.findById(id);
        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        reservation.status = ReservationStatus.CONFIRMED;
        return reservation.save();
    }

    async cancel(id: string, userId?: string) {
        const reservation = await this.reservationModel.findById(id);
        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        // Strict ownership validation if userId is provided (Participant case)
        if (userId && reservation.userId.toString() !== userId) {
            throw new ForbiddenException('You can only cancel your own reservations');
        }

        reservation.status = ReservationStatus.CANCELED;
        return reservation.save();
    }
}
