import { dbConnect } from '../../../util/mongodb'

const initDatabase = async () => {
  try {
    const { db } = await dbConnect()

    return {
      selvesCollection: db.collection('selves'),
    }
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const { headers, method } = req

  let { order, sort } = req.query

  switch (method) {
    case 'GET':
      try {
        if (!sort) sort = 'name'
        let sortObj = {}
        sortObj[sort] = order === 'desc' ? -1 : 1

        const { selvesCollection } = await initDatabase()
        const result = await selvesCollection.find({}).sort(sortObj).toArray()
        const selves = JSON.parse(JSON.stringify(result))

        res.status(200).json({ success: true, data: selves })
      } catch (error) {
        console.error(error)
        res.status(400).json({ success: false })
      }
    break

    default:
      console.error(`Unexpected ${method} attempt on /api/selves`)
      res.status(400).json({ success: false })
    break
  }
}
