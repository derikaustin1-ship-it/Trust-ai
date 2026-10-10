import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('TRUSTIQ AI App', () => {
  it('renders landing page headline', () => {
    render(<App />);
    expect(screen.getByText(/AI that knows when/i)).toBeInTheDocument();
  });
});
