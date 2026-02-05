import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventBookingButton } from './EventBookingButton';
import { ReservationCard } from './ReservationCard';
import * as api from '../lib/api';

// Mock API
jest.mock('../lib/api', () => ({
    createReservation: jest.fn(),
    getTicket: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('Reservation Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock URL.createObjectURL and revokeObjectURL
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost:3000/test-blob');
        global.URL.revokeObjectURL = jest.fn();
    });

    describe('Booking an Event', () => {
        it('successfully reserves an event', async () => {
            (api.createReservation as jest.Mock).mockResolvedValue({ status: 'CONFIRMED' });

            render(<EventBookingButton eventId="event-123" />);

            const registerButton = screen.getByRole('button', { name: /register now/i });
            fireEvent.click(registerButton);

            await waitFor(() => {
                expect(api.createReservation).toHaveBeenCalledWith('event-123');
                expect(screen.getByText('Reservation confirmed!')).toBeInTheDocument();
            });
        });
    });

    describe('Downloading Ticket', () => {
        const mockReservation = {
            _id: 'res-123',
            status: 'CONFIRMED',
            createdAt: '2024-01-01T10:00:00Z',
            event: {
                _id: 'event-123',
                title: 'Tech Conference 2024',
                date: '2024-12-25T10:00:00Z',
                location: 'Convention Center',
            },
        };

        it('initiates ticket download for confirmed reservation', async () => {
            const mockBlob = new Blob(['fake-pdf-content'], { type: 'application/pdf' });
            (api.getTicket as jest.Mock).mockResolvedValue(mockBlob);

            // Spy on HTMLAnchorElement.prototype.click
            const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { });

            // Spy on document.createElement to verify link creation (optional, but good for verification)
            const createElementSpy = jest.spyOn(document, 'createElement');
            const appendChildSpy = jest.spyOn(document.body, 'appendChild');
            const removeChildSpy = jest.spyOn(document.body, 'removeChild');

            render(
                <ReservationCard
                    reservation={mockReservation}
                    onCancel={jest.fn()}
                    cancellingId={null}
                />
            );

            const getTicketButton = screen.getByRole('button', { name: /get ticket/i });
            fireEvent.click(getTicketButton);

            await waitFor(() => {
                expect(api.getTicket).toHaveBeenCalledWith('res-123');
            });

            // Verify download link manipulation
            expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);

            // Verify anchor was created and clicked
            expect(createElementSpy).toHaveBeenCalledWith('a');
            expect(appendChildSpy).toHaveBeenCalled(); // We don't check the exact node to avoid strict equality issues, just that something was appended
            expect(clickSpy).toHaveBeenCalled();
            expect(removeChildSpy).toHaveBeenCalled();

            clickSpy.mockRestore();
            createElementSpy.mockRestore();
            appendChildSpy.mockRestore();
            removeChildSpy.mockRestore();
        });
    });
});
