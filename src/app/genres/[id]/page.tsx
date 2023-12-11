import { useIntParam } from '../../../utils/routes'
import { redirect } from 'next/navigation'

export default function Page({
  params: { id: stringValue },
}: {
  params: { id: string }
}) {
  const id = useIntParam(stringValue)

  let url = '/genres'
  if (id !== undefined) {
    url += '?id=' + id
  }

  redirect(url.toString())
}
