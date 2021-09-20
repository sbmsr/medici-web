import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import InputField from '../components/InputField'
import NavBar from '../components/NavBar'

export default function CreatePost(): JSX.Element {
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
      <NavBar user={session.user} hideCTA={true} />
      <main className="flex flex-col mx-0 px-0 max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <div className="flex flex-row justify-between px-5 py-10 md:px-0 text-2xl">
          <span>Create Post</span>
        </div>
        <InputField name="Post Name" optional={false} placeholder="" />
        <InputField name="Price" optional={true} placeholder="$10.00" />
        <button
          type="button"
          className="m-auto w-1/3 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </main>
    </>
  )
}
