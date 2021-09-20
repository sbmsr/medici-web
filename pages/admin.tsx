import { getSession, signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import Table from '../components/Table'

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
      <main className="flex flex-col mx-0 px-0 max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="flex flex-row justify-between px-5 py-10 md:px-0 text-2xl">
          <text className="">Dashboard</text>
          <text className="">Balance: $15,000</text>
        </div>
        <Table />
      </main>
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
