import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './pages/Login';

test('renders login page', () => {
  render(<MemoryRouter><Login /></MemoryRouter>);
  expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
});