import Account from './Account'

export default function Page({ params: { id } }: { params: { id: string } }) {
  return <Account id={id} />
}
