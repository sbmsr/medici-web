// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import { db } from './_db'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: db.getDatabaseName() })
}

export default handler
