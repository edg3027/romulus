import { MediaTypeTreeNotFoundError } from '../domain/errors'
import type { IMediaTypeTreeRepository } from '../domain/repository'

export class MergeTreesCommand {
  constructor(
    public readonly sourceTreeId: string,
    public readonly targetTreeId: string,
  ) {}
}

export class MergeTreesCommandHandler {
  constructor(private treeRepo: IMediaTypeTreeRepository) {}

  async handle(command: MergeTreesCommand) {
    // allow when:
    // - you have media-type-trees:admin permission
    // - you have media-type-trees:write permission & you are the owner of the target tree

    const sourceTree = await this.treeRepo.get(command.sourceTreeId)
    if (sourceTree instanceof MediaTypeTreeNotFoundError) {
      return sourceTree
    }

    const targetTree = await this.treeRepo.get(command.targetTreeId)
    if (targetTree instanceof MediaTypeTreeNotFoundError) {
      return targetTree
    }

    const lastCommonCommit = sourceTree.getLastCommonCommit(targetTree)
    const baseTree = await this.treeRepo.getToCommit(command.sourceTreeId, lastCommonCommit)
    if (baseTree instanceof MediaTypeTreeNotFoundError) {
      return baseTree
    }

    const error = targetTree.merge(sourceTree, baseTree)
    if (error instanceof Error) {
      return error
    }

    await this.treeRepo.save(command.targetTreeId, targetTree)
  }
}
