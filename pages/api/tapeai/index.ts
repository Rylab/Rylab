import { NextApiRequest, NextApiResponse } from 'next'
import { BASE_URL } from '../../../utils/constants'
import { validateUuid } from '../../../utils/helpers'

const defaultModel = 'gpt-6-luna'
const defaultReasoning = 'none'
const defaultTemperature = 1
const maxCompletionTokens = 800

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
  'unique',
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
  'techno',
]

const jsonCoercion = `You are a database agent for many large music record collections. ` +
  `Respond only with valid JSON. Respond with an array of 3 relevant records with unique artist, title, and biography properties. ` +
  `Valid JSON format: ` +
  `[{"title":"string","artist":"string","bio":string"},{"title":"string","artist":"string","bio":string"},{"title":"string","artist":"string","bio":string"}]`

const getAdjectives = (adjectives: string) => {
  const trimmedAdjectives = adjectives.trim().replace(/^"(.+(?="$))"$/, '$1')

  return trimmedAdjectives ?? defaultAdjectives[~~(Math.random() * defaultAdjectives.length)]
}

const getGenre = (genre: string) => {
  const trimmedGenre = genre.trim().replace(/^"(.+(?="$))"$/, '$1')

  return trimmedGenre ?? defaultGenres[~~(Math.random() * defaultGenres.length)]
}

const getModel = (model: string) => {
  if (model && model.trim()) return model.trim()

  return defaultModel
}

const getReasoning = (reasoning: string) => {
  if (reasoning && reasoning.trim()) return reasoning.trim() ?? defaultReasoning

  return defaultReasoning
}

const getTemperature = (temperature: string) => {
  if (temperature && temperature.trim()) return temperature.trim() ?? defaultTemperature

  return defaultTemperature
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.OPENAI_KEY) {
    return res.status(500).json({
      error: {
        message: 'OpenAI API key not set; see instructions in README.md',
      }
    })
  }

  const { headers, method, query } = req
  const uuid = validateUuid(headers['x-uuid'])

  if (!uuid) {
    console.warn('Invalid or empty UUID: ', uuid)

    return res.status(401).json({
      error: {
        message: 'UUID not set; see instructions in README.md',
      }
    })
  }

  const isAdmin = headers['x-admin'] === process.env.MANAGE_PASS

  switch (method) {
    case 'GET':
      const adjectives = getAdjectives(query.adjectives as string)
      const genre = getGenre(query.genre as string)

      if (!genre) {
        return res.status(400).json({
          error: {
            message: 'Genre type not valid; see instructions in README.md',
          }
        })
      }

      const model = getModel(query.model as string)
      const reasoning = getReasoning(query.reasoning as string)
      const temperature = getTemperature(query.temperature as string)

      const prompt = generateCassettePrompt(genre, adjectives)

      const isReasoningModel = /^(gpt-5|gpt-6|o\d)/.test(model)

      const completionRequest = {
        max_completion_tokens: maxCompletionTokens,
        model,
        ...(isReasoningModel ? { reasoning_effort: reasoning } : {}),
        messages: [
          {
            role: 'system',
            content: jsonCoercion
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        ...(!isReasoningModel || reasoning === 'none' ? { temperature } : {}),
        user: uuid,
      }

      try {
        const cassettesJson = await fetch('https://api.openai.com/v1/chat/completions', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            'OpenAI-Organization': process.env.OPENAI_ORG ?? '',
          },
          method: 'POST',
          body: JSON.stringify(completionRequest),
        }).then(response => {
          console.info(response)

          return response.json()
        })

        console.log(cassettesJson)

        if (cassettesJson && cassettesJson.choices?.length > 0) {
          const tapes = {
            created: new Date().toISOString(),
            completionRequest,
            data: [],
            uuid,
          }

          try {
            const [first] = cassettesJson.choices
            const tapeList = first.message.content.trim()

            tapes.data = JSON.parse(tapeList)

            await fetch(`${BASE_URL}/api/tapes`, {
              headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'x-uuid': uuid,
              },
              method: 'POST',
              body: JSON.stringify(tapes),
            })

            return res.status(200).json(tapes.data)
          } catch (error) {
            console.error(error)

            return res.status(400).json(tapes.data)
          }
        } else {
          console.warn(cassettesJson)
          return res.status(400).json({ error: { message: 'Missing expected completion data' } })
        }
      } catch (error: any) {
        console.error(error)

        if (error.response) {
          return res.status(400).json(error.response)
        } else {
          return res.status(400).json({
            error: {
              message: 'An unexpected error occurred processing your request.',
            }
          })
        }
      }
      break

    default:
      return res.status(400).json({
        error: {
          message: `Unexpected ${method} attempt on /api/tapeai`,
        }
      })
      break
  }
}

function generateCassettePrompt(genre: string, adjectives: string) {
  const capitalizedAdjectives =
    adjectives[0].toUpperCase() + adjectives.slice(1)

  const capitalizedGenre =
    genre[0].toUpperCase() + genre.slice(1).toLowerCase()

  const generatedPrompt =
    `Create 3 unique band personas in the genre "${capitalizedGenre}", ` +
    `and their "${capitalizedAdjectives}" distinct album titles.`

  console.log(`\n\n${generatedPrompt}..`)

  return generatedPrompt
}
