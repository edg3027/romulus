import { expect } from 'vitest'

import { test } from '../../../../../../../vitest-setup'
import {
  MediaTypeTreeAlreadyExistsError,
  MediaTypeTreeNameInvalidError,
  UnauthorizedError,
} from '../domain/errors'
import { MediaTypeTreePermission } from '../domain/permissions'
import { MemoryTreeRepository } from '../infrastructure/memory-tree-repository'
import { AddMediaTypeCommand, AddMediaTypeCommandHandler } from './add-media-type'
import {
  AddParentToMediaTypeCommand,
  AddParentToMediaTypeCommandHandler,
} from './add-parent-to-media-type'
import { CopyTreeCommand, CopyTreeCommandHandler } from './copy-tree'
import { CreateTreeCommand, CreateTreeCommandHandler } from './create-tree'
import { MergeTreesCommand, MergeTreesCommandHandler } from './merge-trees'

type Command =
  | CreateTreeCommand
  | AddMediaTypeCommand
  | AddParentToMediaTypeCommand
  | CopyTreeCommand
  | MergeTreesCommand

async function given(repo: MemoryTreeRepository, commands: Command[]): Promise<void> {
  for (const command of commands) {
    const error = await executeCommand(repo, command)
    if (error instanceof Error) {
      expect.fail(`Failed to execute command: ${error.message}`)
    }
  }
}

async function executeCommand(repo: MemoryTreeRepository, command: Command): Promise<void | Error> {
  if (command instanceof CreateTreeCommand) {
    return new CreateTreeCommandHandler(repo).handle(command)
  } else if (command instanceof AddMediaTypeCommand) {
    return new AddMediaTypeCommandHandler(repo).handle(command)
  } else if (command instanceof AddParentToMediaTypeCommand) {
    return new AddParentToMediaTypeCommandHandler(repo).handle(command)
  } else if (command instanceof CopyTreeCommand) {
    return new CopyTreeCommandHandler(repo).handle(command)
  } else if (command instanceof MergeTreesCommand) {
    return new MergeTreesCommandHandler(repo).handle(command)
  }
}

test('should create a media type tree', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set([MediaTypeTreePermission.WRITE])
  await given(repo, [])

  // when
  const error = await executeCommand(
    repo,
    new CreateTreeCommand('tree', 'Tree', userId, permissions),
  )

  // then
  expect(error).toBeUndefined()
})

test('should create a media type tree with admin permissions', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set([MediaTypeTreePermission.ADMIN])
  await given(repo, [])

  // when
  const error = await executeCommand(
    repo,
    new CreateTreeCommand('tree', 'Tree', userId, permissions),
  )

  // then
  expect(error).toBeUndefined()
})

test('should error if the name is empty', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set([MediaTypeTreePermission.WRITE])
  await given(repo, [])

  // when
  const error = await executeCommand(repo, new CreateTreeCommand('tree', '', userId, permissions))

  // then
  expect(error).toEqual(new MediaTypeTreeNameInvalidError(''))
})

test('should error if the name is only whitespace', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set([MediaTypeTreePermission.WRITE])
  await given(repo, [])

  // when
  const error = await executeCommand(repo, new CreateTreeCommand('tree', ' ', userId, permissions))

  // then
  expect(error).toEqual(new MediaTypeTreeNameInvalidError(' '))
})

test('should error if the name is only newlines', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set([MediaTypeTreePermission.WRITE])
  await given(repo, [])

  // when
  const error = await executeCommand(
    repo,
    new CreateTreeCommand('tree', '\n\n', userId, permissions),
  )

  // then
  expect(error).toEqual(new MediaTypeTreeNameInvalidError('\n\n'))
})

test('should error if a tree with the id already exists', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set([MediaTypeTreePermission.WRITE])
  await given(repo, [new CreateTreeCommand('tree', 'Tree', userId, permissions)])

  // when
  const error = await executeCommand(
    repo,
    new CreateTreeCommand('tree', 'New Tree', userId, permissions),
  )

  // then
  expect(error).toEqual(new MediaTypeTreeAlreadyExistsError('tree'))
})

test('should error if the caller has no permissions', async () => {
  // given
  const repo = new MemoryTreeRepository()
  const userId = 0
  const permissions = new Set<MediaTypeTreePermission>()
  await given(repo, [])

  // when
  const error = await executeCommand(
    repo,
    new CreateTreeCommand('tree', 'Tree', userId, permissions),
  )

  // then
  expect(error).toEqual(new UnauthorizedError())
})