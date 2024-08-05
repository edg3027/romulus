import { render, waitFor } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'svelte'
import { expect, vi } from 'vitest'

import { test } from '../../../../vitest-setup'
import AccountAppsPage from './+page.svelte'

function setup(props: ComponentProps<AccountAppsPage>) {
  const user = userEvent.setup()

  const returned = render(AccountAppsPage, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    props: { disableFormSubmission: true, ...props },
  })

  const getCreateButton = () => returned.getByRole('button', { name: 'Create a key' })
  const getCreateDialog = () => returned.getByRole('dialog')
  const queryCreateDialog = () => returned.queryByRole('dialog')

  const onSubmit = vi.fn()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  returned.component.$on('submit', (e) => onSubmit(e.detail))

  return {
    user,
    getCreateButton,
    getCreateDialog,
    queryCreateDialog,
    onSubmit,
    ...returned,
  }
}

test('should show an empty state when there are no keys', () => {
  const { getByText, getCreateButton } = setup({ data: { user: undefined, keys: [] } })
  expect(getByText('No keys found')).toBeInTheDocument()
  expect(getCreateButton()).toBeInTheDocument()
})

test('should show existing keys in table', () => {
  const date1 = new Date('2021-01-01')
  const date2 = new Date('2021-01-02')

  const returned = setup({
    data: {
      user: undefined,
      keys: [
        { name: 'key-one', createdAt: date1 },
        { name: 'key-two', createdAt: date2 },
      ],
    },
  })

  expect(returned.getByText('key-one')).toBeInTheDocument()
  expect(returned.getByText('key-two')).toBeInTheDocument()

  expect(returned.getByText('Dec 31, 2020, 7:00:00 PM')).toBeInTheDocument()
  expect(returned.getByText('Jan 1, 2021, 7:00:00 PM')).toBeInTheDocument()
})

test('should show a dialog when create key is clicked', async () => {
  const { getCreateButton, getCreateDialog, user } = setup({
    data: { user: undefined, keys: [] },
  })
  await user.click(getCreateButton())
  expect(getCreateDialog()).toBeInTheDocument()
})

test('should close the dialog when cancel is clicked', async () => {
  const { getCreateButton, getCreateDialog, queryCreateDialog, getByRole, user } = setup({
    data: { user: undefined, keys: [] },
  })
  await user.click(getCreateButton())
  expect(getCreateDialog()).toBeInTheDocument()
  await user.click(getByRole('button', { name: 'Cancel' }))
  await waitFor(() => expect(queryCreateDialog()).toBeNull())
})

test('should submit the new key when create is clicked', async () => {
  const {
    getCreateButton,
    getCreateDialog,
    queryCreateDialog,
    getByRole,
    getByLabelText,
    user,
    onSubmit,
  } = setup({
    data: { user: undefined, keys: [] },
  })
  await user.click(getCreateButton())
  expect(getCreateDialog()).toBeInTheDocument()
  await user.type(getByLabelText('Name'), 'key-name')
  await user.click(getByRole('button', { name: 'Create' }))
  expect(onSubmit).toHaveBeenCalledWith({ name: 'key-name' })
  await waitFor(() => expect(queryCreateDialog()).toBeNull())
})