const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeAppts () {
  return [
    {
      id: 'fe05b144-5cd2-46a5-9bed-85bcc7f9d36d',
      longitude: "-81.3729264",
      latitude: "28.665953",
      address: '285 Windmeadows Street, Altamonte Springs, FL 32701',
      title: 'Chevy Movie Theater',
      start_time: '2020-07-26T18:28',
      end_time: '2020-07-26T19:28',
      description: 'Interior crocodile alligator',
      user_id: 'cdadeb7a-e757-4bfe-976a-c451f43400fc'
    },
    {
      id: '98060f43-8606-4830-aa62-0bfa79ed730f',
      longitude: "-81.3537",
      latitude: "28.625579",
      address: '137 Shell Point West, Maitland, FL 32751',
      title: 'A Shelly Place',
      start_time: '2020-07-26T20:28',
      end_time: '2020-07-26T21:28',
      description: 'She sells sea shells',
      user_id: 'cdadeb7a-e757-4bfe-976a-c451f43400fc'
    },
    {
      id: 'c65ba5b6-480c-4365-af2d-c1fafd65c8a3',
      longitude: "-81.407945",
      latitude: "28.632812",
      address: 'Circle Community Church, Pembrook Drive, Maitland, FL 32810',
      title: 'Circle Community Church',
      start_time: '2020-07-26T15:28',
      end_time: '2020-07-26T16:28',
      description: 'A night at the round table',
      user_id: '7765ca99-b371-476d-8d4b-2c5b24b5f6d2'
    },
    {
      id: 'eef16620-2aaf-40dd-bbf2-d88e8082d9a6',
      longitude: "-81.35473",
      latitude: "28.588807",
      address: 'Clarendon Avenue, Winter Park, FL 32789',
      title: 'Clarendon',
      start_time: '2020-07-27T13:28',
      end_time: '2020-07-27T15:28',
      description: 'Hometown party',
      user_id: '7765ca99-b371-476d-8d4b-2c5b24b5f6d2'
    },
    {
      id: 'dbe5d837-a08b-4df7-be5e-a705eaaa2143',
      longitude: "-81.457384",
      latitude: "28.578557",
      address: '5600 Fair Oak Court, Orange County, FL 32808',
      title: 'A Fair Court',
      start_time: '2020-07-27T17:28',
      end_time: '2020-07-27T18:28',
      description: 'A fair time',
      user_id: '67444311-1d29-4e22-abb7-1f889aab9ee3'
    }
  ]
}

function makeUsersArray () {
  return [
    {
      id: 'cdadeb7a-e757-4bfe-976a-c451f43400fc',
      username: 'test-user-1',
      visible_name: 'Test user 1',
      company: 'TU1',
      email: 'TU1@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: '7765ca99-b371-476d-8d4b-2c5b24b5f6d2',
      username: 'test-user-2',
      visible_name: 'Test user 2',
      company: 'TU2',
      email: 'TU2@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: '67444311-1d29-4e22-abb7-1f889aab9ee3',
      username: 'test-user-3',
      visible_name: 'Test user 3',
      company: 'TU3',
      email: 'TU3@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: '0d545b0c-9edf-4152-adfe-a420ecbd598c',
      username: 'test-user-4',
      visible_name: 'Test user 4',
      company: 'TU4',
      email: 'TU4@email.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    }
  ]
}

function seedUsers (db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db
    .into('mav_users')
    .insert(preppedUsers)
}

function seedAppts (db) {
  const appts = makeAppts()
  return db
    .into('appointments')
    .insert(appts)
}

function makeExpectedAppts (user, appts) {
  let userAppts = appts
    .filter(appt => appt.user_id === user.id)
    .sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time)
    })

  return userAppts
}

function makeMaliciousAppt (user) {
  const date = new Date().toUTCString()
  const maliciousAppt = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    address: '123 Fake Street, Main, Maine 12345',
    longitude: 10,
    latitude: -10,
    start_time: date,
    end_time: date,
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: 1
  }
  const expectedAppt = {
    ...makeExpectedAppts([user], maliciousThing, date),
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousAppt,
    expectedAppt
  }
}

function cleanTables (db) {
  return db.raw(
    `TRUNCATE
      appointments,
      mav_users
      `
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
  algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeAppts,
  makeUsersArray,
  makeExpectedAppts,
  makeMaliciousAppt,
  makeAuthHeader,
  seedUsers,
  seedAppts,
  cleanTables
}
