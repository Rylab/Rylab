import { NextApiRequest, NextApiResponse } from 'next'

import { Song } from '../../../types'
import { dbCollection } from '../../../utils/mongodb'
import { validateUuid } from '../../../utils/helpers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, method } = req

  let isAdmin = headers['x-admin'] === process.env.MANAGE_PASS
  let { filter = '{}', order = 'asc', sort = '' } = req.query

  let data: Song[] = []
  let filterObject = {}
  let result = null
  let sortObject = {}
  let uuid = validateUuid(headers['x-uuid']) ?? 'anonymous'

  switch (method) {
    case 'GET':
      try {
        const { songsCollection } = await dbCollection('songs') as any

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

        if (songsCollection) {
          result = await songsCollection.find(filterObject).sort(sortObject).toArray()
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
        const { songsCollection } = await dbCollection('songs') as any
        const { song } = req as any

        if (!uuid) {
          console.warn('POST: ', song)
          res.status(401).json({ success: false })
          break
        }

        const result = await songsCollection.insertOne(song)

        res.status(200).json({ success: true, data: result })
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false })
      }
      break

    default:
      console.error(`Unexpected ${method} attempt on /api/songs`)
      res.status(400).json({ success: false })
      break
  }
}
