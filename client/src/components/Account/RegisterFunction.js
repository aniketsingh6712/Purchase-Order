import axios from 'axios'

export function registerUser(newUserDetails){
    console.log(newUserDetails)
    let apiUrl = 'http://localhost:3001/api/user/register'
    return axios.post(apiUrl,newUserDetails,{
        headers:{
            'Content-Type': 'application/json'
        }
    })
}
