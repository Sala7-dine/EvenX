import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.PARTICIPANT)
    @Post()
    create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
        return this.reservationsService.create(createReservationDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id/confirm')
    confirm(@Param('id') id: string) {
        return this.reservationsService.confirm(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.reservationsService.cancel(id);
    }
}
