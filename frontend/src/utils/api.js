class Api {
    constructor({ url }) {
        this._url = url
    }


    _checkRes(res) {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(`${res.status}`)
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            headers: {
                authorization: this.getToken(),
            }
        })
            .then(this._checkRes)
    }

    getCards() {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            headers: {
                authorization: this.getToken(),
            }
        })
            .then(this._checkRes)
    }

    handleUserInfo(userData) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: this.getToken(),
            },
            body: JSON.stringify({
                name: userData.userName,
                about: userData.userDescription
            })
        })
            .then(this._checkRes)
    }
    handleUserAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                authorization: this.getToken(),
            },
            body: JSON.stringify({
                avatar: data.userAvatar,
            })
        })
            .then(this._checkRes)
    }

    addCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: this.getToken(),
            },
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
            .then(this._checkRes)
    }

    like(id) {
        return fetch(`${this._url}/cards/likes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: this.getToken(),
            },
        })
            .then(this._checkRes)
    }

    dislike(id) {
        return fetch(`${this._url}/cards/likes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: this.getToken(),
            },
        })
            .then(this._checkRes)
    }

    delete(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: this.getToken(),
            },
        })
            .then(this._checkRes)
    }

    getToken() {
        return `Bearer ${localStorage.getItem('token')}`
    }


    getAll() {
        return Promise.all([this.getCards(), this.getUserInfo()])
    }
}

const api = new Api({
    url: 'https://api.legion3d.students.nomoredomainssbs.ru'
})

export default api;
