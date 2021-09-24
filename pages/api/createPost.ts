// Import the required AWS SDK clients and commands for Node.js
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import Ajv from 'ajv'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { formSchema } from '../createPost'
import { s3Client } from './libs/_s3Client' // Helper function that creates Amazon S3 service client module.
import { db } from './_db'

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
ajv.addFormat(
  'data-url',
  /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/
)
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
    const { amount, files } = body
    files

    // retrieve user's store
    const user = await db.models.users.findOne({
      where: { email: session.user.email },
    })

    // create new post
    const newPost = await db.models.posts.create({
      user: user.getDataValue('id'),
      amount: parseAmount(amount),
    })

    // TODO: upload content to s3

    // store s3 link in db as content
    await db.models.content.create({
      post: newPost.getDataValue('id'),
      url: 'https://www.google.com' + Math.random(),
    })
    res.status(201).end()
    return
  } catch (e) {
    console.error(e)
    res.status(500).end()
    return
  }
}
export const createPresignedUrlForFile = async (file: string) => {
  file
  try {
    // Create the command.
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `test-object-${Math.ceil(Math.random() * 10 ** 10)}`,
      Body: 'BODY',
    })

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    })

    const response = await fetch(signedUrl)
    return response
  } catch (err) {
    console.error('Error creating presigned URL', err)
  }
}
