import { describe, it, expect } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import App from '@p45hicks/site/App';

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />)
    expect(screen.getByText(/Welcome to p45hicks.github.io/i)).toBeInTheDocument();
  })
})
