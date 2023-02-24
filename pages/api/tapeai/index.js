import { NextResponse } from 'next/server'

import { validateUuid } from '../../../utils/helpers'

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


// const jsonCoercionWithBio = ` Respond only with an array of 3 valid JSON objects, each having artist, title, and biography properties. `
const jsonCoercion = ` Respond only with an array of 3 valid JSON objects with artist, title, and biography properties. `
  + `JSON response format: `
  + `[{"title":"string","artist":"string","bio":string"},{"title":"string","artist":"string","bio":string"},{"title":"string","artist":"string","bio":string"}]`


const getAdjectives = adjectives => {
  const trimmedAdjectives = adjectives.trim().replace(/^"(.+(?="$))"$/, '$1')

  return trimmedAdjectives ?? defaultAdjectives[~~(Math.random() * defaultAdjectives.length)]
}

const getGenre = genre => {
  const trimmedGenre = genre.trim().replace(/^"(.+(?="$))"$/, '$1')

  return trimmedGenre ?? defaultGenres[~~(Math.random() * defaultGenres.length)]
}

const getModel = model => {
  if (model && model.trim()) return model.trim()

  return defaultModel
}

const getTemperature = temperature => {
  if (temperature && temperature.trim()) return temperature.trim() ?? defaultTemperature

  return defaultTemperature
}

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (!process.env.OPENAI_KEY) {
    return NextResponse.json(JSON.stringify({
      error: {
        message: 'OpenAI API key not set; see instructions in README.md',
      }
    }), { status: 500 })
  }

  const { headers, method, nextUrl } = req
  const uuidHeader = headers.get('x-uuid')
  let uuid
  
  if (uuidHeader && validateUuid(uuidHeader)) {
    uuid = uuidHeader
  } else {
    console.warn('Invalid or empty UUID:')
    console.warn(uuidHeader)
  }
  
  if (!uuid) {
    return NextResponse.json(JSON.stringify({
      error: {
        message: 'UUID not set; see instructions in README.md',
      }
    }), { status: 400 })
  }
  
  const isAdmin = headers.get('x-admin') === process.env.MANAGE_PASS
  const searchParams = new URLSearchParams(decodeURI(nextUrl.search))

  switch (method) {
    case 'GET':
    const adjectives = getAdjectives(searchParams.get('adjectives'))
    const genre = getGenre(searchParams.get('genre'))

    if (!genre) {
      return NextResponse.json(JSON.stringify({
        error: {
          message: 'Genre type not valid; see instructions in README.md',
        }
      }), { status: 400 })
    }


    const model = getModel(searchParams.get('model'))
    const temperature = getTemperature(searchParams.get('temperature'))

    const prompt = generateCassettePrompt(genre, adjectives)

    const completionRequest = {
      max_tokens,
      model,
      prompt,
      temperature,
      user: uuid,
    }

    try {
      const cassettesResult = await fetch('https://api.openai.com/v1/completions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
          'OpenAI-Organization': process.env.OPENAI_ORG ?? '',
        },
        method: 'POST',
        body: JSON.stringify(completionRequest),
      })

      const cassettesJson = await cassettesResult.json()

      console.log(`Genre: ${genre}`)
      console.log(`Adjectives: ${adjectives}`)
      if (cassettesJson && cassettesJson.choices) {
        console.log(JSON.parse(cassettesJson.choices[0].text.trim()))
        return NextResponse.json(cassettesJson.choices[0].text.trim(), { status: 200 })
      } else {
        console.warn(cassettesResult)
        return NextResponse.json(JSON.stringify({ error: { message: 'Missing expected completion data' }}), { status: 400 })
      }
    } catch(error) {
      console.error(error)

      if (error.response) {
        return NextResponse.json(JSON.stringify(error.response), { status: 400 })
      } else {
        return nNextResponse.json(JSON.stringify({
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

function generateCassettePrompt(genre, adjectives) {
  const generatedPrompt =
    `Come up with 3 unique names for music artists in the "${genre}" genre and their "${adjectives}" style album title.`

  console.log(`\n\n${generatedPrompt}`)

  return generatedPrompt + jsonCoercion
}
