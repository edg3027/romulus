import { useEffect, useMemo } from 'react'

const useWarnOnUnsavedChanges = ({
  dirtyFields,
  isSubmitted,
  isSubmitting,
}: {
  dirtyFields: Record<string, unknown>
  isSubmitted?: boolean
  isSubmitting?: boolean
}) => {
  const hasDirtyFields = useMemo(
    () => Object.values(dirtyFields).some((dirty) => !!dirty),
    [dirtyFields]
  )

  useEffect(() => {
    const confirmationMessage = 'Changes you made may not be saved.'
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      ;(e || window.event).returnValue = confirmationMessage
      return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
    }
    if (!(isSubmitting || isSubmitted) && hasDirtyFields) {
      window.addEventListener('beforeunload', beforeUnloadHandler)
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [hasDirtyFields, isSubmitted, isSubmitting])
}

export default useWarnOnUnsavedChanges
