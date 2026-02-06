import { render, screen } from '@testing-library/react';
import { EventCard } from './EventCard';

describe('EventCard', () => {
    const mockEvent = {
        _id: '123',
        title: 'Test Event',
        description: 'This is a test event description',
        date: '2024-12-25T10:00:00.000Z',
        location: 'Test Location',
        capacity: 100,
    };

    it('renders event details correctly', () => {
        render(<EventCard event={mockEvent} />);

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('This is a test event description')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
    });

    it('contains the correct link', () => {
        render(<EventCard event={mockEvent} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/events/123');
    });
});
