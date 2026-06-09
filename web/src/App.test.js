import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders the main heading', () => {
  render(<App />);
  const heading = screen.getByText(/ARC EKS Demo/i);
  expect(heading).toBeInTheDocument();
});

test('renders runner info list', () => {
  render(<App />);
  expect(screen.getByText(/spot instances/i)).toBeInTheDocument();
  expect(screen.getByText(/on-demand instances/i)).toBeInTheDocument();
});
