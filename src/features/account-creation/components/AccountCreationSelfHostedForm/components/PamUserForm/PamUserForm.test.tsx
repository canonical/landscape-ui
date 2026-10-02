import { renderWithProviders } from '@/tests/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PamUserForm from './PamUserForm';

const onSubmit = vi.fn();

describe('PamUserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the PAM user fields', () => {
    renderWithProviders(<PamUserForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText('PAM identity')).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('PAM password')).toBeInTheDocument();
  });

  it('requires a nonblank name and identity', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PamUserForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Full name'), '   ');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('PAM identity'), '   ');
    await user.type(screen.getByLabelText('PAM password'), 'PAMPassword1');

    expect(await screen.findAllByText('This field is required')).toHaveLength(
      2,
    );
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('explains the forbidden PAM identity characters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PamUserForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Full name'), 'John Doe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('PAM identity'), 'john*doe');
    await user.type(screen.getByLabelText('PAM password'), 'PAMPassword1');

    expect(
      await screen.findByText(
        'Identity cannot contain these characters: (, ), *, \\, or \\0 (NUL).',
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
