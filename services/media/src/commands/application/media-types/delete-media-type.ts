import type { MediaTypeDeletedEvent } from '../../../common/domain/events.js'
import type { MaybePromise } from '../../../utils.js'
import type { DeleteMediaTypeCommand } from '../../domain/media-types/delete-media-type.js'
import { deleteMediaType } from '../../domain/media-types/delete-media-type.js'

export type DeleteMediaTypeCommandHandler = (command: DeleteMediaTypeCommand) => Promise<void>

export function createDeleteMediaTypeCommandHandler(
  saveEvent: (event: MediaTypeDeletedEvent) => MaybePromise<void>,
): DeleteMediaTypeCommandHandler {
  return async function (command) {
    const event = deleteMediaType(command)

    await saveEvent(event)
  }
}
