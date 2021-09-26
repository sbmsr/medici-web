import Form from '@rjsf/core'
import { JSONSchema7 } from 'json-schema'
import { signIn, useSession } from 'next-auth/react'
import React from 'react'
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
      minItems: 1,
    },
  },
}

const uiSchema = {
  files: {
    'ui:options': {
      accept: ['.mp4', '.jpg', '.jpeg', '.png', '.mov'],
    },
  },
}

const formData = {
  amount: '10.00',
  files: [],
}

const getMetaForDataURIString = (dataURIString) => {
  return {
    fileName: dataURIString.split('data:')[1].split(';')[1].split('=')[1],
    mimeType: dataURIString.split('data:')[1].split(';')[0],
  }
}

const handleOnSubmit = async ({ formData }) => {
  console.error(`received ${JSON.stringify(formData)}`)
  const meta = formData.files.map(getMetaForDataURIString)

  const res = await fetch('/api/createPost', {
    method: 'POST',
    body: JSON.stringify({
      amount: formData.amount,
      meta: meta,
    }),
  })

  if (res.status !== 201) {
    console.error(await res.json())
    return
  }

  const presignedUrls = await res.json()

  const uploadToS3 = () =>
    presignedUrls.map(async (url, idx) => {
      await fetch(url, {
        method: 'PUT',
        body: formData.files[idx],
      })
    })

  try {
    await Promise.all(await uploadToS3())
  } catch (e) {
    console.error(e)
  }
}

export default function CreatePost(): JSX.Element {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn()
    },
  })

  if (status !== 'authenticated') return <h1> loading </h1>

  return (
    <>
      <NavBar user={session.user} hideCTA={true} />
      <main className="flex flex-col mx-0 px-0 max-w-7xl md:mx-auto md:px-4 lg:px-8">
        <Form
          schema={formSchema}
          uiSchema={uiSchema}
          formData={formData}
          onSubmit={(x) => handleOnSubmit(x)}
        />
      </main>
    </>
  )
}
