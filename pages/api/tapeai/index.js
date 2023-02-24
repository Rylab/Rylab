import { Configuration, OpenAIApi } from 'openai'
import { validateUuid } from '../../../utils/helpers'
import { dbCollection } from '../../../utils/mongodb'

const { MANAGE_PASS } = process.env

const defaultModel = 'text-davinci-003'
const defaultTemperature = 0.5
const max_tokens = 400

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

const jsonCoercion = ` Respond only with an array of 3 valid JSON objects with artist and title properties. `
const jsonCoercionWithBio = ` Respond only with an array of 3 valid JSON objects, each having artist, title, and biography properties. `

const getAdjectives = query => {
  const trimmedAdjectives = query.adjectives.trim().replace(/^"(.+(?="$))"$/, '$1')

  return trimmedAdjectives ?? defaultAdjectives[~~(Math.random() * defaultAdjectives.length)]
}

const getGenre = query => {
  const trimmedGenre = query.genre.trim().replace(/^"(.+(?="$))"$/, '$1')

  return trimmedGenre ?? defaultGenres[~~(Math.random() * defaultGenres.length)]
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
    const adjectives = getAdjectives(query)
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

    const cassettePrompt = generateCassettePrompt(genre, adjectives)

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
      console.log(`Adjectives: ${adjectives}`)
      console.log(cassetteJson)

      res.status(200).json(cassetteJson)
    } catch(error) {
      console.error(error)

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
      const { tapeAiCollection } = await dbCollection('tapeAi')
      const { headers, body } = req

      if (!isAdmin && headers['x-uuid'] !== body.uuid) {
        res.status(401).json({ success: false })
        break
      }

      const result = await tapeAiCollection.save(body)

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

function generateCassettePrompt(genre, adjectives) {
  const generatedPrompt =
    `Come up with 3 unique names for music artists in the "${genre}" genre and their "${adjectives}" style album titles.`

  console.log(generatedPrompt)

  return generatedPrompt + jsonCoercion
}
