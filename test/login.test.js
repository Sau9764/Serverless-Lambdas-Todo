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

    let todo = { id: '1', todo: "this is task" }

    expect.assertions(1)

    try {
        let res = await Axios.post(`https://9cuwgcqll5.execute-api.ap-south-1.amazonaws.com/dev/`, todo, { headers: {
                'X-Amz-Security-Token': `${token}`,
                'Content-Type': 'application/json'
            }
        })
        console.log(res.status)
        expect(res.status).toBe(200)
    }catch(err) {
        console.log(err)
    }
})
