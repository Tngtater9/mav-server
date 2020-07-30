const express = require('express')
const xss = require('xss')
const AppointmentsService = require('./AppointmentsService')

const AppointmentsRouter = express.Router()
const jsonParser = express.json()

const serializeAppointment = appt => ({
  id: appt.id,
  title: xss(appt.title),
  address: xss(appt.address),
  longitude: xss(appt.longitude),
  latitude: xss(appt.latitude),
  start_time: xss(appt.start_time),
  end_time: xss(appt.end_time),
  description: xss(appt.description),
  date_created: appt.date_created
})

AppointmentsRouter.route('/')
  .get((req, res, next) => {
    AppointmentsService.getAllAppointments(req.app.get('db'), 1)
      .then(appts => {
        res.json(appts.map(serializeAppointment))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {
      title,
      address,
      longitude,
      latitude,
      start_time,
      end_time = null,
      description = ''
    } = req.body
    const newAppt = {
      title,
      address,
      longitude,
      latitude,
      start_time,
      end_time,
      description
    }

    if (!title) {
      logger.error('Title not entered')
      return res.status(400).json({ error: { message: 'Title required' } })
    }

    AppointmentsService.createAppointment(req.app.get('db'), newAppt)
      .then(appt => {
        logger.info(`Appointment named ${appt.title} with id ${appt.id}`)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${appt.id}`))
          .json(serializeAppointment(appt))
      })
      .catch(next)
  })

AppointmentsRouter.route('/date/:date').get((req, res, next) => {
  let { date } = req.params

  let from = new Date(date)
  let to = new Date(from)

  to.setDate(from.getDate() + 1)

  AppointmentsService.getByDate(req.app.get('db'), 1, from, to)
    .then(appts => {
      res.json(appts.map(serializeAppointment))
    })
    .catch(next)
})

AppointmentsRouter.route('/:id')
  .all((req, res, next) => {
    AppointmentsService.getById(req.app.get('db'), req.params.id)
      .then(appt => {
        if (!appt) {
          return res.status(404).json({
            error: { message: `Appointment doesn't exist` }
          })
        }
        res.appt = appt
        next()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    AppointmentsService.deleteAppointment(req.app.get('db'), req.params.id)
      .then(rowsaffected => {
        return res.status(204).end()
      })
      .catch(next)
  })

module.exports = AppointmentsRouter
