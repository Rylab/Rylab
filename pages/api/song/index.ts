import { NextApiRequest, NextApiResponse } from 'next'

import { dbCollection } from '../../../utils/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { headers, method } = req

  let { order, sort } = req.query
  let isAdmin = headers['x-admin'] === process.env.MANAGE_PASS

  switch (method) {
    case 'GET':
      try {
        if (!sort) sort = 'artist'
        let sortObj = {}
        // sortObj[sort] = order === 'desc' ? -1 : 1

        const { songsCollection } = await dbCollection('songs') as any
        const result = await songsCollection.find({}).sort(sortObj).toArray()
        const songs = JSON.parse(JSON.stringify(result))

        res.status(200).json({ success: true, data: songs })
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false })
      }
      break

    case 'POST':
      try {
        const { songsCollection } = await dbCollection('songs') as any
        const { headers, body } = req
        const { song } = body

        if (!isAdmin && headers['x-uuid'] !== song.uuid) {
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
