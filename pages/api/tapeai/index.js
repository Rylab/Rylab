import { Configuration, OpenAIApi } from 'openai'
import { validateUuid } from '../../../utils/helpers'
import { dbCollection } from '../../../utils/mongodb'

const { MANAGE_PASS } = process.env

// TODO: make defaults more dynamic? base on previously submitted values?

const defaultModel = 'text-davinci-003'

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
  apiKey: process.env.OPENAI_API,
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

    const artistNamePrompt = generateArtistNamePrompt(genre, adjective)
    const songTitlePrompt = generateSongTitlePrompt(genre, adjective)

    let result = {};
    try {
      const artistRes = await openai.createCompletion({
        model,
        prompt: artistNamePrompt,
        temperature,
      })

      const titleRes = await openai.createCompletion({
        model,
        prompt: songTitlePrompt,
        temperature,
      })

      result.artist = artistRes.data.choices[0].text
      result.title = titleRes.data.choices[0].text

      res.status(200).json(result)
    } catch(error) {
      console.error(error)
      if (error.response) {
        console.error(error.response.status, error.response.data)

        res.status(error.response.status).json(error.response.data)
      } else {
        console.error(`Error from OpenAI API: ${error.message}`)

        res.status(500).json({
          error: {
            message: 'An error occurred processing your request.',
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

function generateArtistNamePrompt(genre, adjective = 'funny') {
  const capitalizedGenre =
    genre[0].toUpperCase() + genre.slice(1).toLowerCase()

  return `Suggest three ${adjective ? `${adjective} ` : ''}names for a music artist in the ${capitalizedGenre} Genre.
Genre:Rock
Names:The Beatles, School House Rockers, Rock Around The Clockers
Genre:Jazz
Names:Puff the Jazzy Dragon, Xena: Piano Princess, Miles Davis
Genre:${capitalizedGenre}
Names:`
}

function generateSongTitlePrompt(genre, adjective = 'wild') {
  const capitalizedGenre =
    genre[0].toUpperCase() + genre.slice(1).toLowerCase()

  return `Suggest three ${adjective ? `${adjective} ` : ''} titles for a song in the ${capitalizedGenre} Genre.
Genre:Rock
Titles:Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Genre:Jazz
Titles:Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Genre:${capitalizedGenre}
Titles:`
}
