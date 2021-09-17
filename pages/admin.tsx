import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { initWeb3 } from '../lib/web3'

export const Admin = (): JSX.Element => {
  const { data: session } = useSession()

  const [api, setApi] = useState(undefined)

  useEffect(() => {
    if (!api) {
      initWeb3(setApi)
    }

    if (session) {
      // TODO: Fetch Data here.
    }
  }, [])

  if (!api) return <h1> loading </h1>

  return (
    <main className="flex flex-col items-center m-auto">
      {session ? (
        <>
          Signed in as {session.user.name}{' '}
          {session.user.email && `With email: ${session.user.email}`} <br />
          <button onClick={() => signOut()}>Sign out</button>{' '}
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </main>
  )
}

export async function getServerSideProps(ctx: any): Promise<any> {
  return {
    props: {
      session: await getSession(ctx),
    },
  }
}

export default Admin
