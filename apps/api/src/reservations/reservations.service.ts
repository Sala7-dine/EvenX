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
import PDFDocument = require('pdfkit');

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

        // 3. Check if User already booked
        const existingReservation = await this.reservationModel.findOne({
            userId: userId as any,
            eventId: eventId as any,
            status: { $ne: ReservationStatus.CANCELED },
        });

        if (existingReservation) {
            throw new BadRequestException('You have already booked this event');
        }

        // 4. Create Reservation
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

    async generateTicket(id: string, userId: string): Promise<Buffer> {
        const reservation = await this.reservationModel
            .findById(id)
            .populate('eventId')
            .populate('userId');

        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        if (reservation.status !== ReservationStatus.CONFIRMED) {
            throw new BadRequestException(
                'Ticket not available for unconfirmed reservation',
            );
        }

        const event = reservation.eventId as any;
        const user = reservation.userId as any;

        return new Promise((resolve) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', (buffer) => buffers.push(buffer));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            doc.fontSize(25).text('EvenX Ticket', { align: 'center' });
            doc.moveDown();

            doc.fontSize(18).text(`Event: ${event.title}`);
            doc.fontSize(14).text(
                `Date: ${new Date(event.date).toLocaleDateString()}`,
            );
            doc.text(`Location: ${event.location}`);
            doc.moveDown();

            doc.fontSize(16).text('Participant Details');
            doc.fontSize(14).text(`Name: ${user.name}`);
            doc.text(`Email: ${user.email}`);
            doc.moveDown();

            doc.fontSize(12).text(`Reservation ID: ${reservation._id}`);
            doc.text(`Status: ${reservation.status}`);
            doc.moveDown();

            doc.fontSize(10).text('Please present this ticket at the entrance.', {
                align: 'center',
            });

            doc.end();
        });
    }
}
