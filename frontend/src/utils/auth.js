export const BASE_URL = 'https://api.legion3d.students.nomoredomainssbs.ru';
const HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const checkRes = (res) => {
    if (res.ok) {
        return res.json()
    }
    return Promise.reject(`${res.status}`)
};

export const register = ({ password, email }) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            "password": password,
            "email": email
        })
    })
        .then(checkRes)
};

export const authorize = ({ password, email }) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            "password": password,
            "email": email
        })
    })
        .then(checkRes)
};

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            ...HEADERS,
            'Authorization': `Bearer ${token}`
        }
    })
        .then(checkRes)
};