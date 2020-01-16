const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store =  require('../store')

const bookmarksRouter = express.Router();
const bodyParser =  express.join();

bookmarksRouter
    .route('./bookmarks')
    .get((req,res) => {
        res.json(store.bookmarks)
    })
    .post(bodyParser, (req, res) => {
        for (const field of ['title', 'url', 'rating']) {
            if(!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field}' is required`)
            }
        }

        const { title, url, description, rating } = req.body

        if(!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
        }

        const bookmark = {id: uuid(), title, url, description, rating}

        store.bookmarks.push(bookmark)
        logger.info(`Bookmark with ID ${bookmark.id} created`)
        res
         .status(201)
         .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
         .json(bookmark)
    })

bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res) => {
        const { bookmark_id } = req.params

        const bookmark =  store.bookmarks.find(c => c.id ==bookmark_id)

        if(!bookmark){
            logger.error(`Bookmark with id ${bookmark_id} not found`)
            return
            .status(404)
            .res('Bookmark not found')
        }

        res.json(bookmark)
    })

    .delete((req, res) => {
        const { bookmark_id } = req.params
        const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)

        if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    store.bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with id ${bookmark_id} deleted.`)
    res
      .status(204)
      .end()
  })
    })

module.exports =  bookmarksRouter