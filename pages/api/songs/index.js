import { dbCollection } from '../../../utils/mongodb'

const { MANAGE_PASS } = process.env

export default async function handler(req, res) {
  const { headers, method } = req

  let isAdmin = headers['x-admin'] === MANAGE_PASS
  let { filter = '{}', order = 'asc', sort = '' } = req.query

  let data = []
  let filterObject = {}
  let result = null
  let sortObject = {}
  let songsCollection
  let uuid = headers['x-uuid'] ?? 'anon'

  switch (method) {
    case 'GET':
      try {
        songsCollection = await dbCollection('songs')

        if (isAdmin) {
          filterObject = JSON.parse(filter) || {}
        } else {
          filterObject = {
            '$or': [
              { uuid },
              { public: true },
            ],
          }
        }

        sort = sort.trim() ?? 'artist'
        sortObject[sort] = order === 'desc' ? -1 : 1

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
        songsCollection = await dbCollection('songs')
        const { song } = req

        if (!uuid) {
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
