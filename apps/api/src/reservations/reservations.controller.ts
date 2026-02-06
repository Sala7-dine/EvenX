import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  ForbiddenException,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Post()
  create(@Body() createReservationDto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(
      createReservationDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Get('me')
  findMyReservations(@Request() req) {
    return this.reservationsService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PARTICIPANT)
  @Get(':id/ticket')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="ticket.pdf"')
  async getTicket(@Param('id') id: string, @Request() req) {
    const user = req.user;

    const buffer = await this.reservationsService.generateTicket(
      id,
      user.userId,
    );
    return new StreamableFile(buffer);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.reservationsService.confirm(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PARTICIPANT)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    const user = req.user;
    if (user.role === Role.ADMIN) {
      return this.reservationsService.cancel(id);
    } else if (user.role === Role.PARTICIPANT) {
      return this.reservationsService.cancel(id, user.userId);
    }
    throw new ForbiddenException('Unauthorized action');
  }
}
