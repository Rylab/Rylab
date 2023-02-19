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
    query: { id },
    method,
  } = req

  let now = new Date()
  let songRes
  let songUpdate
  let isAdmin = headers['x-admin'] === MANAGE_PASS

  let _id
  let uuid
  switch (method) {
    case 'GET':
      try {
        _id = new ObjectId(id)

        const { songCollection } = await initDatabase()
        songRes = await songCollection.findOne({ _id })

        res.status(200).json({ success: true, data: songRes })
      } catch (error) {
        console.warn(error)

        res.status(400).json({ success: false, data: {
          '_id': 404,
          'artist': 'Try Again',
          'title': 'Song Not Found',
        } })
      }
    break
      
    case 'PUT':
      if (headers['x-uuid'] && validateUuid(uuid)) {
        uuid = headers['x-uuid']
        validateUuid(uuid)
      } else {
        res.status(401).json({ success: false })
        break
      }
      
      if (uuid !== req.body.uuid) {
        res.status(401).json({ success: false })
        break
      }

      try {
        _id = new ObjectId(id)
        const { songCollection } = await initDatabase()

        if (_id && _guestId) {
          songUpdate = {
            guestId: req.body.guestId,
            artist: req.body.artist ? req.body.artist.trim() : '',
            title: req.body.title ? req.body.title.trim() : '',
            notes: req.body.notes ? req.body.notes.trim() : '',
          }

          now = new Date()
          songUpdate.updated = now

          songRes = await songCollection.updateOne({ _id }, { $set: songUpdate, new: true })
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
