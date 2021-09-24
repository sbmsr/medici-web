import { S3Client } from '@aws-sdk/client-s3'
const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
})

export { s3Client }
