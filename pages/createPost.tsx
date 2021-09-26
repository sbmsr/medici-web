import Form from '@rjsf/core'
import { JSONSchema7 } from 'json-schema'
import { signIn, useSession } from 'next-auth/react'
import React, { useState } from 'react'
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

const submitCreatePost = async ({ files, amount }) => {
  const meta = files.map(getMetaForDataURIString)

  const res = await fetch('/api/createPost', {
    method: 'POST',
    body: JSON.stringify({
      amount: amount,
      meta: meta,
    }),
  })

  if (res.status !== 201) {
    console.error(await res.json())
    return
  }

  const presignedUrls = await res.json()
  return presignedUrls
}

const attemptUploadToS3 = async (files: string[], presignedUrls: string[]) => {
  await Promise.all(
    presignedUrls.map(async (url, idx) => {
      await fetch(url, {
        method: 'PUT',
        body: files[idx],
      })
    })
  )
}

export default function CreatePost(): JSX.Element {
  const [step, setStep] = useState(0)
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn()
    },
  })

  if (status !== 'authenticated') return <h1> loading </h1>

  const handleOnSubmit = async ({ formData }) => {
    const presignedUrls = await submitCreatePost(formData)
    setStep(1)
    try {
      await attemptUploadToS3(formData.files, presignedUrls)
      setStep(2)
    } catch (e) {
      setStep(-1)
      return
    }
  }

  return (
    <>
      <NavBar user={session.user} hideCTA={true} />
      <main className="flex flex-col mx-0 px-0 max-w-7xl md:mx-auto md:px-4 lg:px-8">
        {step == -1 && (
          <>
            <span> There was an error, please try again! </span>{' '}
            <Form
              schema={formSchema}
              uiSchema={uiSchema}
              formData={formData}
              onSubmit={handleOnSubmit}
            />
          </>
        )}

        {step == 0 && (
          <Form
            schema={formSchema}
            uiSchema={uiSchema}
            formData={formData}
            onSubmit={async (event) => await handleOnSubmit(event)}
          />
        )}
        {step == 1 && (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-3"
              viewBox="0 0 24 24"
            ></svg>
            <span>Uploading Content . . .</span>
          </>
        )}
        {step == 2 && <span> Done! </span>}
      </main>
    </>
  )
}
