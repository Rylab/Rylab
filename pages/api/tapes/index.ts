import { NextApiRequest, NextApiResponse } from 'next'

import { dbCollection } from '../../../utils/mongodb'
import { validateUuid } from '../../../utils/helpers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, method } = req

  let isAdmin = headers['x-admin'] === process.env.MANAGE_PASS
  let { filter = '{}', order = 'asc', sort = '' } = req.query

  let data: any = []
  let filterObject = {}
  let result = null
  let sortObject = {}
  let uuid = validateUuid(headers['x-uuid']) ?? 'anonymous'

  switch (method) {
    case 'GET':
      try {
        const { tapesCollection } = await dbCollection('tapes') as any

        if (isAdmin) {
          filterObject = JSON.parse(filter as string) ?? {}
        } else {
          filterObject = {
            '$or': [
              { uuid },
              { public: true },
            ],
          }
        }

        // sort = sort ? sort.trim() : 'artist'
        // sortObject[sort] = order === 'desc' ? -1 : 1

        if (tapesCollection) {
          result = await tapesCollection.find(filterObject).sort(sortObject).toArray()
          data = JSON.parse(JSON.stringify(result))
        }

        res.status(200).json({ success: true, data })
      } catch (error) {
        console.error(error)
        data = []
        result = null
        res.status(400).json({ success: false, data, error })
      }
      break

    case 'POST':
      try {
        const { tapesCollection } = await dbCollection('tapes') as any

        if (!uuid || uuid !== req.body.uuid) {
          console.warn('POST: ', req.body)
          res.status(401).json({ success: false })
          break
        }

        const result = await tapesCollection.insertOne(req.body)

        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false })
      }
      break

    default:
      console.error(`Unexpected ${method} attempt on /api/tapes`)
      res.status(400).json({ success: false })
      break
  }
}
