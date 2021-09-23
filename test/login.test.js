const login = require('../src/login')
const Axios = require('axios')

test('Checking login object', () => {
    expect(typeof login).toBe('object')
})

let token = ''

test('testing function working', async () => {
    
    let data = { username: 'test1', password: 'test123' }

    expect.assertions(1)

    try {
        let res = await Axios.post('http://localhost:3000/dev/login', data)
        token = res.data.id_token
        expect(res.status).toBe(200)
    }catch(err) {
        console.log(err)
    }
})

test('Adding todo in table', async () => {

    let todo = "this is task"

    expect.assertions(1)

    try {
        // https://9cuwgcqll5.execute-api.ap-south-1.amazonaws.com/dev/
        let res = await Axios.post(`https://9cuwgcqll5.execute-api.ap-south-1.amazonaws.com/dev/`, {todo}, { 
            headers: {
                'X-Amz-Security-Token': `${token}`,
                'Content-Type': 'application/json'
            }
        })
        expect(res.status).toBe(200)
    }catch(err) {
        console.log('Error while adding')
        console.log(err)
    }
})
