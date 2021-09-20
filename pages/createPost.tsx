import { getSession, signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import NavBar from '../components/NavBar'

export default function CreatePost(): JSX.Element {
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
      <NavBar user={session.user} hideCTA={true} />
      <h1>Hello Create Post</h1>
      <button
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Button text
      </button>
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
