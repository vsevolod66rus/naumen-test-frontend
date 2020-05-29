import axios from 'axios';
import qs from 'qs';

const urlBase = 'http://localhost:9090/'
const getUrl = 'getContacts'
const addUrl = 'addContact'
const editUrl = 'changeContact'
const findUrl = 'findBy'
const deleteUrl = 'deleteContact'

export default class Service {

    catchError(error) {
        if (error.response.status === 404) {
            return ({
                userMessage: "Request not found"
            })
        } else {
            return ({
                userMessage: error.response.data,
            })
        }
    }

    getContacts() {
        return axios.get(urlBase + getUrl).then((response) => {
            return ({
                persons: response.data,
                newContactModal: false,
                editContactModal: false,
                findContactModal: false,
                deleteContactModal: false
            })
        })
    }

    addContact(name, phoneNumber) {
        console.log(name, phoneNumber)
        return axios.post(urlBase + addUrl,
            qs.stringify({
                "name": name,
                "phoneNumber": phoneNumber
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(() => this.getContacts()
        ).catch(error => this.catchError(error))
    }

    editContact(id, name, phoneNumber) {
        return axios.put(urlBase + editUrl,
            qs.stringify({
                "id": id,
                "name": name,
                "phoneNumber": phoneNumber
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(() => this.getContacts()
        ).catch(error => this.catchError(error))
    }

    findContact(filter, subStr) {
        return axios.get(urlBase + findUrl + filter, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                "filter": subStr
            }
        }).then((response) => {
                return ({
                    persons: response.data,
                    findContactModal: false
                })
            }
        ).catch(error => this.catchError(error))
    }

    deleteContact(id) {
        return axios.delete(urlBase + deleteUrl,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    "id": id
                }
            }
        ).then(() => this.getContacts()
        ).catch(error => this.catchError(error))
    }
}
