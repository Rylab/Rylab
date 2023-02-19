import { ObjectId } from 'mongodb'
import { dbConnect } from '../../../utils/mongodb'

const { MANAGE_PASS } = process.env

const initDatabase = async () => {
  try {
    const { db } = await dbConnect()

    return {
      songsCollection: db.collection('songs'),
    }
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const { headers, method } = req

  let isAdmin = headers['x-admin'] === MANAGE_PASS
  let { filter, order, sort } = req.query

  let uuid

  switch (method) {
    case 'GET':
      try {
        if (!filter) filter = {}
        if (!sort) sort = 'artist'
        let sortObj = {}
        sortObj[sort] = order === 'desc' ? -1 : 1

        const { songsCollection } = await initDatabase()
        const result = await songsCollection.find(filter).sort(sortObj).toArray()
        const songs = JSON.parse(JSON.stringify(result))

        res.status(200).json({ success: true, data: songs })
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false })
      }
    break

    case 'POST':
      try {
        const { songsCollection } = await initDatabase()
        const { song } = req

        if (headers['x-uuid']) {
          uuid = ObjectId(headers['x-uuid'])
        } else {
          console.warn('POST: ', song)
          res.status(401).json({ success: false })
          break
        }

        const result = await songsCollection.save(song)

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