const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./Fixtures/MakeAppts')
const { expect } = require('chai')

describe('Appointments Endpoints', () => {
    let db

    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]
    const testAppts = helpers.makeAppts()
    const testAppt = testAppts[0]

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/appointments/', () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
        beforeEach('insert appointments', () => helpers.seedAppts(db))

        it('responds with appointments array and 200', () => {
            const expected = helpers.makeExpectedAppts(testUser, testAppts)
            return supertest(app)
                .get('/api/appointments/')
                .set('Authorization',helpers.makeAuthHeader(testUser))
                .expect(200)                
                .expect(res => {
                    expect(res.body[0].id).to.eql(expected[0].id)
                    expect(res.body[0].title).to.eql(expected[0].title)
                    expect(res.body[0].longitude).to.eql(expected[0].longitude)
                    expect(res.body[0].latitude).to.eql(expected[0].latitude)
                    expect(res.body[0].address).to.eql(expected[0].address)
                    expect(res.body[0].description).to.eql(expected[0].description)
                    expect(res.body[0].user_id).to.eql(expected[0].user_id)
                })
        })
    })
    describe('POST /api/appointments/', () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

        const requiredFields = ['title', 'address', 'longitude', 'latitude', 'start_time']

        requiredFields.forEach(field => {
            const apptAttemptBody = {
                title: testAppt.title,
                address: testAppt.address,
                longitude: testAppt.longitude,
                latitude: testAppt.latitude,
                start_time: testAppt.start_time
            }
            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete apptAttemptBody[field]

                return supertest(app)
                .post('/api/appointments/')
                .set('Authorization',helpers.makeAuthHeader(testUser))
                .send(apptAttemptBody)
                .expect(400, {
                    error: `Missing '${field}' in request body`
                    })
            })
        
        
        })
    })
})