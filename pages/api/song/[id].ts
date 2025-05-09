import { NextApiRequest, NextApiResponse } from 'next';

import { validateUuid } from '../../../utils/helpers'
import { dbCollection } from '../../../utils/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    headers,
    query: { id },
    method,
  } = req

  const isAdmin = headers['x-admin'] === process.env.MANAGE_PASS

  let now = new Date()
  let songRes
  let songUpdate

  let uuid

  switch (method) {
    case 'GET':
      try {
        const { songsCollection = false } = await dbCollection('songs') as any
        songRes = await songsCollection.findOne({ '_id': id })

        res.status(200).json({ success: true, data: songRes })
      } catch (error) {
        console.warn(error)

        res.status(400).json({
          success: false, data: {
            '_id': 404,
            artist: 'Try Again',
            title: 'Song Not Found',
          }
        })
      }
      break

    case 'PUT':
      if (headers['x-uuid'] && validateUuid(headers['x-uuid'])) {
        uuid = headers['x-uuid']
      } else {
        res.status(401).json({ success: false })
        break
      }

      if (uuid !== req.body.uuid && !isAdmin) {
        res.status(401).json({ success: false })
        break
      }

      if (!req.body.artist || !req.body.title) {
        res.status(400).json({ success: false })
        break
      }

      try {
        const { songsCollection } = await dbCollection('songs') as any

        if (id && isAdmin) {
          songUpdate = {
            artist: req.body.artist ? req.body.artist.trim() : '',
            title: req.body.title ? req.body.title.trim() : '',
            notes: req.body.notes ? req.body.notes.trim() : '',
            updated: new Date(),
          }

          songRes = await songsCollection.updateOne({ '_id': id }, { $set: songUpdate, new: true })
        }
        res.status(202).json({ success: true, data: songRes })
      } catch (error) {
        console.warn(error)
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}
