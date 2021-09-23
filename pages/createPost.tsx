import Form from '@rjsf/core'
import { JSONSchema7 } from 'json-schema'
import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'

export const formSchema: JSONSchema7 = {
  title: 'Create Post',
  type: 'object',
  required: ['files'],
  properties: {
    amount: {
      type: 'string',
      pattern: '^(0|([1-9]+[0-9]*))(.[0-9]{1,2})?$',
      minLength: 1,
      default: '$10.00',
    },
    files: {
      type: 'array',
      title: 'Multiple files',
      items: { type: 'string', format: 'data-url' },
    },
  },
}

const uiSchema = {
  files: {
    'ui:options': {
      accept: ['.mp4', '.jpg', '.jpeg', '.png'],
    },
  },
}

const formData = {
  amount: '10.00',
  files: [],
}

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
        <Form
          schema={formSchema}
          uiSchema={uiSchema}
          formData={formData}
          onSubmit={() =>
            fetch('/api/createPost', {
              method: 'POST',
              body: JSON.stringify(formData),
            }).then((res) => res.json())
          }
        />
      </main>
    </>
  )
}
