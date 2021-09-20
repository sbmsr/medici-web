import { getSession, signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'

export const Admin = (): JSX.Element => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      // TODO: Fetch Data here.
    }
  }, [])

  if (!session) {
    signIn()
  }

  if (!session) return <h1> loading </h1>

  return (
    <>
      <NavBar user={session.user} />
      <main className="flex flex-col items-center m-auto"></main>
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps(ctx: any): Promise<any> {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

export default Admin
