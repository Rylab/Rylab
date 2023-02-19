import { Configuration, OpenAIApi } from 'openai'
import { getUuid } from '../../../utils/helpers'

// TODO: actual specific UUID validation in addition to basic sanity check
const UUID_LENGTH = 36

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

const getAdjective = req => {
  return req.body?.adjective?.trim() || defaultAdjectives[~~(Math.random() * defaultAdjectives.length)]
}

const getGenre = req => {
  return req.body?.genre?.trim() || defaultGenres[~~(Math.random() * defaultGenres.length)]
}

const getModel = req => {
  return req.body?.model?.trim() ?? defaultModel
}

const getTemperature = req => {
  return req.body?.temperature?.trim() ?? defaultTemperature
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

  const uuid = getUuid(req)

  if (!uuid) {
    res.status(400).json({
      error: {
        message: 'UUID not set; see instructions in README.md',
      }
    })

    return
  }

  const isAdmin = headers['x-admin'] === MANAGE_PASS

  const adjective = getAdjective(req)
  const genre = getGenre(req)

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

  try {
    const artistName = await openai.createCompletion({
      model,
      prompt: artistNamePrompt,
      temperature,
    })

    const songTitle = await openai.createCompletion({
      model,
      prompt: songTitlePrompt,
      temperature,
    })

    console.log(
      artistNamePrompt, artistName
    )

    console.log(
      songTitlePrompt, songTitle
    )

    res.status(200).json({ result: {
      artistName: artistName.data.choices[0].text,
      songTitle: songTitle.data.choices[0].text,
      }
    })
  } catch(error) {
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
}

function generateArtistNamePrompt(genre, adjective = 'funny') {
  const capitalizedGenre =
    genre[0].toUpperCase() + genre.slice(1).toLowerCase()

  return `Suggest three ${adjective ? `${adjective} ` : ''}} new names for a ${capitalizedGenre} Genre artist.

Genre: Rock
Names: The Beatles, School House Rockers, Rock Around The Clockers
Genre: Jazz
Names: Puff the Jazzy Dragon, Xena: Piano Princess, Miles Davis
Genre: ${capitalizedGenre}
Names:`
}

function generateSongTitlePrompt(genre, adjective = 'wild') {
  const capitalizedGenre =
    genre[0].toUpperCase() + genre.slice(1).toLowerCase()

  return `Suggest three ${adjective ? `${adjective} ` : ''}} new titles for a ${capitalizedGenre} Genre song.

Genre: Rock
Titles: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Genre: Jazz
Titles: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Genre: ${capitalizedGenre}
Titles:`
}
