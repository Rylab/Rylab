import { ObjectId } from 'mongodb'
import { validateUuid } from '../../../utils/helpers'
import { dbCollection } from '../../../utils/mongodb'

export default async function handler(req, res) {
  const {
    headers,
    query: { uuid },
    method,
  } = req

  let isAdmin = headers['x-admin'] === process.env.MANAGE_PASS
  let now = new Date()
  let songUpdate
  let _uuid

  switch (method) {
    case 'GET':
      try {
        _uuid = new ObjectId(uuid)

        const { songsCollection } = await dbCollection('songs')
        const result = await songsCollection.find({ uuid: _uuid }).toArray()
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
