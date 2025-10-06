import axios from 'axios'

export function logUserIn(userCredentials) {

    let apiUrl = 'http://localhost:3001/api/user/login';
    return axios.post(apiUrl,userCredentials, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
