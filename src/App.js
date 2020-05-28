import React, {Component,} from 'react';
import axios from 'axios';
import qs from 'qs';
import {Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup} from 'reactstrap';

export default class App extends Component {
    state = {
        userMessage: '',
        persons: [],
        currentContactData: {
            id: '',
            name: '',
            phoneNumber: '',
        },
        findContactData: '',
        newContactModal: false,
        editContactModal: false,
        findContactModal: false,
        deleteContactModal: false
    }

    refreshContacts() {
        axios.get('http://localhost:9090/getContacts').then((response) => {
            this.setState({
                persons: response.data,
                newContactModal: false,
                editContactModal: false,
                findContactModal: false,
                deleteContactModal: false,
            })
        })
    }

    componentDidMount() {
        this.refreshContacts()
    }

    catchError(error) {
        if (error.response.status === 404) {
            this.setState({
                userMessage: "Request not found",
            })
        } else {
            this.setState({
                userMessage: error.response.data,
            })
        }
    }

    addContactReq() {
        axios.post('http://localhost:9090/addContact',
            qs.stringify({
                "name": this.state.currentContactData.name,
                "phoneNumber": this.state.currentContactData.phoneNumber
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(() => this.refreshContacts()
        ).catch(error => this.catchError(error))
    }

    editContactReq() {
        axios.put('http://localhost:9090/changeContact',
            qs.stringify({
                "id": this.state.currentContactData.id,
                "name": this.state.currentContactData.name,
                "phoneNumber": this.state.currentContactData.phoneNumber
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(() => this.refreshContacts()
        ).catch(error => this.catchError(error))
    }

    findContactReq(filter) {
        axios.get('http://localhost:9090/findBy' + filter, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                "filter": this.state.findContactData
            }
        }).then((response) => {
            this.setState({
                persons: response.data,
                findContactData: '',
                findContactModal: false
            })
        }).catch(error => this.catchError(error))
    }

    deleteContactReq() {
        axios.delete('http://localhost:9090/deleteContact',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    "id": this.state.currentContactData.id
                }
            }
        ).then(() => this.refreshContacts()
        ).catch(error => this.catchError(error))
    }

    goBack() {
        this.refreshContacts()
    }

    editContact(id, name, phoneNumber) {
        this.setState({
            currentContactData: {
                id,
                name,
                phoneNumber,
            },
            userMessage: "Edit contact",
            editContactModal: !this.state.editContactModal
        })
    }

    deleteContact(id, name, phoneNumber) {
        this.setState({
            currentContactData: {
                id,
                name,
                phoneNumber
            },
            userMessage: "Delete contact",
            deleteContactModal: !this.state.deleteContactModal
        })
    }

    toggleNewContactModal() {
        this.setState({
            currentContactData: {
                id: '',
                name: '',
                phoneNumber: '',
            },
            userMessage: "Add new contact",
            newContactModal: !this.state.newContactModal,
        })
    }

    toggleEditContactModal() {
        this.setState({
            userMessage: "Edit contact",
            editContactModal: !this.state.editContactModal,
        })
    }

    toggleDeleteContactModal() {
        this.setState({
            userMessage: "Delete contact",
            deleteContactModal: !this.state.deleteContactModal,
        })
    }

    toggleFindContactModal() {
        this.setState({
            userMessage: "Find contact",
            findContactModal: !this.state.findContactModal,
        })
    }

    render() {
        let persons = this.state.persons.map((person, index) => {
            return (
                <tr key={person.id}>
                    <td>{index + 1}</td>
                    <td>{person.name}</td>
                    <td>{person.phoneNumber}</td>
                    <td><Button color="warning" size="sm" className="mr-2"
                                onClick={this.editContact.bind(this, person.id, person.name, person.phoneNumber)}>Edit</Button>
                        <Button color="danger" size="sm"
                                onClick={this.deleteContact.bind(this, person.id, person.name, person.phoneNumber)}>Delete</Button>
                    </td>
                </tr>
            )
        });

        return (
            <div className="App container">
                <h2>Phonebook</h2>

                <Button color="success" className="mr-2" onClick={this.toggleNewContactModal.bind(this)}>Add
                    contact</Button>

                <Button color="primary" onClick={this.toggleFindContactModal.bind(this)}>Find contact</Button>

                <Button color="secondary" className="float-right"
                        onClick={this.goBack.bind(this)}>Back</Button>

                <Modal isOpen={this.state.newContactModal} toggle={this.toggleNewContactModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewContactModal.bind(this)}>{this.state.userMessage}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Contact name</Label>
                            <Input name="name" value={this.state.currentContactData.name} onChange={(e) => {
                                let currentContactData = this.state.currentContactData;
                                currentContactData.name = e.target.value;
                                this.setState({currentContactData});
                            }}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Phone number</Label>
                            <Input name="phoneNumber" value={this.state.currentContactData.phoneNumber}
                                   onChange={(e) => {
                                       let currentContactData = this.state.currentContactData;
                                       currentContactData.phoneNumber = e.target.value;
                                       this.setState({currentContactData});
                                   }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.addContactReq.bind(this)}>Add new
                            contact</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewContactModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.editContactModal} toggle={this.toggleEditContactModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditContactModal.bind(this)}>{this.state.userMessage}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Contact name</Label>
                            <Input name="name" value={this.state.currentContactData.name} onChange={(e) => {
                                let currentContactData = this.state.currentContactData;
                                currentContactData.name = e.target.value;
                                this.setState({currentContactData});
                            }}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Phone number</Label>
                            <Input name="phoneNumber" value={this.state.currentContactData.phoneNumber}
                                   onChange={(e) => {
                                       let editContactData = this.state.currentContactData;
                                       editContactData.phoneNumber = e.target.value;
                                       this.setState({editContactData});
                                   }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" onClick={this.editContactReq.bind(this)}>Edit
                            contact</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditContactModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.deleteContactModal} toggle={this.toggleDeleteContactModal.bind(this)}>
                    <ModalHeader
                        toggle={this.toggleDeleteContactModal.bind(this)}>{this.state.userMessage}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">{this.state.currentContactData.name}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">{this.state.currentContactData.phoneNumber}</Label>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteContactReq.bind(this)}>Delete
                            contact</Button>{' '}
                        <Button color="secondary" onClick={this.toggleDeleteContactModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.findContactModal} toggle={this.toggleFindContactModal.bind(this)}>
                    <ModalHeader toggle={this.toggleFindContactModal.bind(this)}>{this.state.userMessage}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="filter">Filter</Label>
                            <Input name="filter" value={this.state.findContactData} onChange={(e) => {
                                let findContactData;
                                findContactData = e.target.value;
                                this.setState({findContactData});
                            }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                                onClick={this.findContactReq.bind(this, 'Name')}>Find
                            contact by name</Button>{' '}
                        <Button color="primary"
                                onClick={this.findContactReq.bind(this, 'Phone')}>Find
                            contact by phone</Button>{' '}
                        <Button color="secondary" onClick={this.toggleFindContactModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Contact Name</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {persons}
                    </tbody>
                </Table>
            </div>
        );
    }
}
