const request = require('supertest');
const app = require('../../app');
const {mongoConnect,mongoDisconnect} = require('../../services/mongo');
// here we are importing supertest as request for assertions
// importing app to for testing it 
describe('Launches API',()=>{
    beforeAll( async()=>{
        await mongoConnect();
    })
    afterAll(async()=>{
        await mongoDisconnect();
    })
    describe('Test GET /launches',()=>{
        test('It should respond with 200 success',async ()=>{
            const response= await request(app)// as it is asynchronous so dding async await instead of callback
            .get('/launches')//testing get request at /launches url 
            .expect('Content-Type',/json/)//checking it's headers which is optional, we can use string also but here we can use expressions too
            .expect(200);//checking if the result of that call is 200
        });
    });
    
    describe('Test POST/launch',()=>{
        const completeLaunchData={
            mission : 'USS enterprise',
            rocket : 'rocket NCC-01D',
            target : 'Kepler-296 A e',
            launchDate : 'January 4,2028'
        }
        const launchDataWithoutDate={
            mission : 'USS enterprise',
            rocket : 'rocket NCC-01D',
            target : 'Kepler-296 A e'
        }
        const completeLaunchDataWithInvalidDate={
            mission : 'USS enterprise',
            rocket : 'rocket NCC-01D',
            target : 'Kepler-296 A e',
            launchDate : 'Hello'
        }
        test('It should respond with 201 success',async ()=>{
            const response= await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type',/json/)//checking it's headers which is optional, we can use string also but here we can use expressions too
            .expect(201);//checking if the result of that call is 201
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
        test('It should catch missing required properties', async()=>{
            const response= await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type',/json/)//checking it's headers which is optional, we can use string also but here we can use expressions too
            .expect(400);//checking if the result of that call is 201
    
            expect(response.body).toStrictEqual({
                err: "Missing required launch properties",
            })
        });
        test('It should catch invalid dates', async()=>{
            const response= await request(app)
            .post('/launches')
            .send(completeLaunchDataWithInvalidDate)
            .expect('Content-Type',/json/)//checking it's headers which is optional, we can use string also but here we can use expressions too
            .expect(400);//checking if the result of that call is 201
    
            expect(response.body).toStrictEqual({
                err: "Invalid launch date",
            })
        });
    })
})
