import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

describe('Dashboard page', () => {
  test('renders main dashboard UI elements', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Heading
    const heading = screen.getByRole('heading', { name: /Student Dashboard/i });
    expect(heading).toBeInTheDocument();

    // Quick action card title
    const resumeCard = screen.getByText(/Resume Analyzer/i);
    expect(resumeCard).toBeInTheDocument();

    // CTA button to upload resume
    const uploadBtn = screen.getByRole('button', { name: /Upload Resume/i });
    expect(uploadBtn).toBeInTheDocument();
  });
});
