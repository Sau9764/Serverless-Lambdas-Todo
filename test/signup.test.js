const signUp = require('../src/testingAPI/signUp')

test('Checking SignUp function', () => {
    expect(typeof signUp).toBe('object')
})

test('Checking insert User function', () => {
    expect(typeof signUp.insertUser).toBe('function')
})

test('testing function working', async () => {
    
    let data = { id: '1', username: 'test1', password: 'test123' }
    let tableName = 'userTable'

    expect.assertions(1)

    try {
        let res = await signUp.insertUser(data, tableName)
        expect(JSON.parse(res.body)).toEqual(data)
    }catch(err){
        console.log(err)
    }
})

