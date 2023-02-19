import { ObjectId } from 'mongodb'
import { validateUuid } from '../../../utils/helpers'
import { dbConnect } from '../../../utils/mongodb'

const { MANAGE_PASS } = process.env

const initDatabase = async () => {
  try {
    const { db } = await dbConnect()
    return {
      songCollection: db.collection('songs'),
    }
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const {
    headers,
    query: { uuid },
    method,
  } = req

  let now = new Date()
  let songUpdate
  let isAdmin = headers['x-admin'] === MANAGE_PASS

  let _uuid
  switch (method) {
    case 'GET':
      try {
        _uuid = new ObjectId(uuid)

        const { songCollection } = await initDatabase()
        const result = await songCollection.find({ uuid: _uuid }).toArray()
        const songs = JSON.parse(JSON.stringify(result))

        res.status(200).json({ success: true, data: songs })
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false })
      }
    break

    default:
      res.status(400).json({ success: false })
    break
  }
}
