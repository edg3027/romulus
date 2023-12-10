import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/genres')
  }, [router])

  return <div />
}

export default Home
