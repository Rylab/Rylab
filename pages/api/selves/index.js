import { WebServiceClient } from '@maxmind/geoip2-node'
import { dbCollection } from '../../../utils/mongodb'

export default async function handler(req, res) {
  const { headers, method } = req

  let { order, sort = 'name' } = req.query

  const GeoIpClient = new WebServiceClient(
    process.env.MAXMIND_ACCOUNT,
    process.env.MAXMIND_LICENSE,
    { host: 'geolite.info' },
  )

  GeoIpClient.city(headers['x-forwarded-for']).then(response => {
    console.log(response)
  }).catch(error => { console.error(error) })

  switch (method) {
    case 'GET':
      let selves = []
      let success

      try {
        const { selvesCollection = false } = await dbCollection('selves')

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
