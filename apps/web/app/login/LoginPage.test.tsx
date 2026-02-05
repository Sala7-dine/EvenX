import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import * as api from '../../lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock API
jest.mock('../../lib/api', () => ({
    login: jest.fn(),
}));

// Mock Cookies
jest.mock('js-cookie', () => ({
    default: {
        set: jest.fn(),
    },
    set: jest.fn(),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form correctly', () => {
        render(<LoginPage />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('updates input fields', () => {
        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('calls login API on form submission', async () => {
        (api.login as jest.Mock).mockResolvedValue({ access_token: 'fake-token' });

        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('displays error message on login failure', async () => {
        // Suppress console.error for this test as we expect an error to be logged
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        (api.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });
});
