import { NextApiRequest, NextApiResponse } from 'next';

import { Self } from '../../../types'
import { dbCollection } from '../../../utils/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  let { order, sort = 'name' } = req.query

  switch (method) {
    case 'GET':
      let selves: Self[] = []
      let success

      try {
        const { selvesCollection } = await dbCollection('selves') as any

        if (selvesCollection) {
          let sortObj = {
            name: 1,
          }

          selves = await selvesCollection.find({}).sort(sortObj).toArray()
        }

        success = true
        res.status(200).json({ success, data: selves })
      } catch (error) {
        console.error(error)

        selves = []
        success = false
        res.status(400).json({ success, data: selves, error })
      }
      break

    default:
      console.error(`Unexpected ${method} attempt on /api/selves`)
      res.status(405).json({ success: false })
      break
  }
}
