const express = require('express')
const path = require('path')
const UsersService = require('./UsersService')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { visible_name, company = '', email, username, password } = req.body

  for (const field of ['visible_name', 'email', 'username', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      })
  
  const passwordError = UsersService.validatePassword(password)

  if (passwordError) {
    return res.status(400).json({ error: passwordError })
  }

  UsersService.hasUserWithUserName(req.app.get('db'), username)
    .then(hasUserWithUserName => {
      if (hasUserWithUserName) {
        return res.status(400).json({ error: `Username already taken` })
      }

      return UsersService.hashPassword(password).then(hashedPassword => {
        const newUser = {
          username,
          visible_name,
          company,
          email,
          password: hashedPassword,
          date_created: 'now()'
        }

        return UsersService.insertUser(req.app.get('db'), newUser).then(
          user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user))
          }
        )
      })
    })
    .catch(next)
})

module.exports = usersRouter
