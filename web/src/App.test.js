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
  const spotItems = screen.getAllByText(/spot instances/i);
  expect(spotItems.length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText(/on-demand instances/i)).toBeInTheDocument();
});
