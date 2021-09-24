// Import the required AWS SDK clients and commands for Node.js
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import Ajv from 'ajv'
import { JSONSchema7 } from 'json-schema'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { s3Client } from './libs/_s3Client' // Helper function that creates Amazon S3 service client module.
import { db } from './_db'

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
ajv.addFormat(
  'data-url',
  /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/
)

export const formSchema: JSONSchema7 = {
  title: 'Create Post',
  type: 'object',
  required: ['meta'],
  properties: {
    amount: {
      type: 'string',
      pattern: '^(0|([1-9]+[0-9]*))(.[0-9]{1,2})?$',
      minLength: 1,
    },
    meta: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fileName: {
            type: 'string',
            minLength: 2,
          },
          mimeType: {
            type: 'string',
            enum: ['video/mp4', 'image/jpeg', 'image/png', 'video/quicktime'],
          },
        },
      },
      minItems: 1,
    },
  },
}

const validate = ajv.compile(formSchema)

const parseAmount = (amt: string): number => parseInt(amt.replace('.', ''))

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).end()
    return
  }

  if (!session.user?.email) {
    res.status(500).end()
    return
  }

  const body = JSON.parse(req.body)

  validate(body)

  if (validate.errors?.length) {
    res.status(400).json(validate.errors)
    validate.errors = []
    return
  }

  try {
    // parse request
    const { amount, meta } = body

    // retrieve user's store
    const user = await db.models.users.findOne({
      where: { email: session.user.email },
    })

    // create new post
    const newPost = await db.models.posts.create({
      user: user.getDataValue('id'),
      amount: parseAmount(amount),
    })

    const presignedUrls = await createPresignedUrlsForFiles(
      meta,
      user.getDataValue('id')
    )

    await Promise.all(
      presignedUrls.map(
        async (url) =>
          await db.models.content.create({
            post: newPost.getDataValue('id'),
            url: url.split('?')[0],
          })
      )
    )

    res.status(201).json(presignedUrls)
    return
  } catch (e) {
    console.error(e)
    res.status(500).end()
    return
  }
}
export const createPresignedUrlsForFiles = async (
  meta: { mimeType: string; fileName: string }[],
  userId: number
): Promise<string[]> => {
  //TODO: create directory in bucket per userId
  try {
    // Create the command.
    const command = (mimeType, fileName) =>
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${userId}/${nanoid()}.${fileName}`,
        ContentType: mimeType,
      })

    const promises = meta.map(
      async ({ mimeType, fileName }) =>
        await getSignedUrl(s3Client, command(mimeType, fileName), {
          expiresIn: 600,
        })
    )

    const signedUrls = await Promise.all(promises)
    return signedUrls
  } catch (err) {
    console.error('Error creating presigned URLs', err)
  }
}
