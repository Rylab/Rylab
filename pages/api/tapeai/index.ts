import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { BASE_URL } from '../../../utils/constants'
import { validateUuid } from '../../../utils/helpers'

const defaultModel = 'gpt-3.5-turbo-instruct'
const defaultTemperature = 0.5
const max_tokens = 500

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

const getTemperature = (temperature: string) => {
  if (temperature && temperature.trim()) return temperature.trim() ?? defaultTemperature

  return defaultTemperature
}

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (!process.env.OPENAI_KEY) {
    return NextResponse.json(JSON.stringify({
      error: {
        message: 'OpenAI API key not set; see instructions in README.md',
      }
    }), { status: 500 })
  }

  const { headers, method, nextUrl } = req
  const uuid = validateUuid(headers.get('x-uuid') as string)

  if (!uuid) {
    console.warn('Invalid or empty UUID: ', uuid)

    return NextResponse.json(JSON.stringify({
      error: {
        message: 'UUID not set; see instructions in README.md',
      }
    }), { status: 401 })
  }

  const isAdmin = headers.get('x-admin') === process.env.MANAGE_PASS
  const searchParams = new URLSearchParams(decodeURI(nextUrl.search))

  switch (method) {
    case 'GET':
      const adjectives = getAdjectives(searchParams.get('adjectives') as string)
      const genre = getGenre(searchParams.get('genre') as string)

      if (!genre) {
        return NextResponse.json(JSON.stringify({
          error: {
            message: 'Genre type not valid; see instructions in README.md',
          }
        }), { status: 400 })
      }

      const model = getModel(searchParams.get('model') as string)
      const temperature = getTemperature(searchParams.get('temperature') as string)

      const prompt = generateCassettePrompt(genre, adjectives)

      const completionRequest = {
        max_tokens,
        model,
        prompt,
        temperature,
        user: uuid,
      }

      try {
        const cassettesJson = await fetch('https://api.openai.com/v1/completions', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            'OpenAI-Organization': process.env.OPENAI_ORG ?? '',
          },
          method: 'POST',
          body: JSON.stringify(completionRequest),
        }).then(res => {
          console.info(res)

          return res.json()
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
            const tapeList = first.text.trim()

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

            return NextResponse.json(tapeList, { status: 200 })
          } catch (error) {
            console.error(error)

            return NextResponse.json(tapes.data, { status: 400 })
          }
        } else {
          console.warn(cassettesJson)
          return NextResponse.json(JSON.stringify({ error: { message: 'Missing expected completion data' } }), { status: 400 })
        }
      } catch (error: any) {
        console.error(error)

        if (error.response) {
          return NextResponse.json(JSON.stringify(error.response), { status: 400 })
        } else {
          return NextResponse.json(JSON.stringify({
            error: {
              message: 'An unexpected error occurred processing your request.',
            }
          }), { status: 400 })
        }
      }
      break

    default:
      return NextResponse.json(JSON.stringify({
        error: {
          message: `Unexpected ${method} attempt on /api/songs`,
        }
      }), { status: 400 })
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

  return generatedPrompt + jsonCoercion
}
