import { dbCollection } from '../../../utils/mongodb'


export default async function handler(req, res) {
  const { headers, method } = req

  let { order, sort = 'name' } = req.query

  switch (method) {
    case 'GET':
      let selves = []
      let success

      try {
        const { selvesCollection } = await dbCollection('selves')

        if (selvesCollection) {
          let sortObj = {}
          sortObj[sort] = order === 'desc' ? -1 : 1

          selves = await selvesCollection.find({}).sort(sortObj).toArray()
        }

        success = true
        res.status(200).json({ success, data: selves })
      } catch (error) {
        console.error(error)

        selves = []
        success = false
        res.status(400).json({ success, data: selves, error })
      }
    break

    default:
      console.error(`Unexpected ${method} attempt on /api/selves`)
      res.status(405).json({ success: false })
    break
  }
}
