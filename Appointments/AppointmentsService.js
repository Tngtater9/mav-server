const AppointmentsService = {
  getAllAppointments (knex, user) {
    return knex
      .select('*')
      .where('user_id', user)
      .orderBy('start_time')
      .from('appointments')
  },
  getByDate (knex, user, from, to) {
    return knex
      .select('*')
      .where('user_id', user)
      .where('start_time', '>=', from)
      .where('start_time', '<', to)
      .orderBy('start_time')
      .from('appointments')
  },
  getById (knex, id) {
    return knex
      .select('*')
      .from('appointments')
      .where({ id })
      .first()
  },
  createAppointment (knex, newAppointment) {
    return knex
      .insert(newAppointment)
      .into('appointments')
      .returning('*')
      .then(rows => rows[0])
  },
  deleteAppointment (knex, id) {
    return knex('appointments')
      .where({ id })
      .delete()
  },
  updateAppointment (knex, id, updatedAppointment) {
    return knex('appointments')
      .where('id', id)
      .update(updatedAppointment)
  }
}

module.exports = AppointmentsService
