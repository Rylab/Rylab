import { Configuration, OpenAIApi } from 'openai'
import { validateUuid } from '../../../utils/helpers'
import { dbCollection } from '../../../utils/mongodb'

const { MANAGE_PASS } = process.env

// TODO: make defaults more dynamic? base on previously submitted values?

const defaultModel = 'text-davinci-003'
const max_tokens = 350

const defaultTemperature = 0.6

const defaultAdjectives = [
  'cheesy',
  'funny',
  'intelligent',
  'popular',
  'serious',
  'silly',
  'surprising',
  'weird',
  'wild',
]

const defaultGenres = [
  'alternative',
  'ambient',
  'country',
  'house',
  'indie',
  'jazz',
  'metal',
  'opera',
  'pop',
  'rap',
  'rockabilly',
  'rock',
]

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
  organization: process.env.OPENAI_ORG,
})

const getAdjective = query => {
  return query.adjective?.trim() || defaultAdjectives[~~(Math.random() * defaultAdjectives.length)]
}

const getGenre = query => {
  return query.genre?.trim() || defaultGenres[~~(Math.random() * defaultGenres.length)]
}

const getModel = query => {
  return query.model?.trim() ?? defaultModel
}

const getTemperature = query => {
  return query.temperature?.trim() ?? defaultTemperature
}

export default async function handler(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not set; see instructions in README.md',
      }
    })
    
    return
  }
  
  const { body, headers, method, query } = req

  let uuid

  if (headers['x-uuid'] && validateUuid(headers['x-uuid'])) {
    uuid = headers['x-uuid']
  } else {
    console.warn('Invalid or empty UUID:')
    console.warn(uuid)
  }

  if (!uuid) {
    res.status(400).json({
      error: {
        message: 'UUID not set; see instructions in README.md',
      }
    })
    
    return
  }
  
  let isAdmin = headers['x-admin'] === MANAGE_PASS
  
  switch (method) {
    case 'GET':
    const adjective = getAdjective(query)
    const genre = getGenre(query)

    if (!genre) {
      res.status(400).json({
        error: {
          message: 'Genre type not valid; see instructions in README.md',
        }
      })

      return
    }

    const openai = new OpenAIApi(configuration)

    const model = getModel(req)
    const temperature = getTemperature(req)

    const cassettePrompt = generateCassettePrompt(genre, adjective)

    try {
      const cassetteRes = await openai.createCompletion({
        max_tokens,
        model,
        prompt: cassettePrompt,
        temperature,
        user: uuid,
      })

      const cassetteJson = JSON.parse(cassetteRes.data.choices[0].text)
      console.log(`\nGenre: ${genre}`)
      console.log(`Adjective: ${adjective}`)
      console.log(cassetteJson)

      res.status(200).json(cassetteJson)
    } catch(error) {
      console.error(error)

      if (cassetteRes) {
        console.log(cassetteRes.data)
      }

      if (error.response) {
        res.status(error.response.status).json(error.response.data)
      } else {
        res.status(500).json({
          error: {
            message: 'An unexpected error occurred processing your request.',
          }
        })
      }
    }
  break

  case 'POST':
    try {
      const { tapeApiCollection } = await dbCollection('tapeAi')
      const { headers, body } = req

      if (!isAdmin && headers['x-uuid'] !== body.uuid) {
        res.status(401).json({ success: false })
        break
      }

      const result = await tapeApiCollection.save(body)

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

function generateCassettePrompt(genre, adjective = 'funny') {
  const capitalizedGenre =
    genre[0].toUpperCase() + genre.slice(1).toLowerCase()

  return `Come up with 3 ${adjective ? `${adjective} ` : ''}names for imaginary music artists in the "${capitalizedGenre}" genre, and their most popular album titles.

  Respond only with an array of 3 valid JSON objects, each having artist and title properties.

  The JSON response should be in this format: [{"artist":"string","title":"string"},{"artist":"string","title":"string"},{"artist":"string","title":"string"}]`
}
