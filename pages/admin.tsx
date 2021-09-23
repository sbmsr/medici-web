import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import Table from '../components/Table'

export const Admin = (): JSX.Element => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn()
    },
  })

  useEffect(() => {
    if (session) {
      // TODO: Fetch Data here.
    }
  }, [])

  if (status !== 'authenticated') return <h1> loading </h1>
  return (
    <>
      <NavBar user={session.user} hideCTA={false} />
      <main className="flex flex-col mx-0 px-0 max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="flex flex-row justify-between px-5 py-10 md:px-0 text-2xl">
          <span>Dashboard</span>
          <span>Balance: $15,000</span>
        </div>
        <Table />
      </main>
    </>
  )
}

export default Admin
