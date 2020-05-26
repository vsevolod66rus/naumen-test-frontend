import React, {Component,} from 'react';
import axios from 'axios';
import qs from 'qs';
import {Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup} from 'reactstrap';

class App extends Component {
    state = {
        messageAdd: "Add new contact",
        messageEdit: "Edit contact",
        messageFind: "Find contact",
        messageDelete: "Delete contact",
        persons: [],
        newContactData: {
            name: '',
            phoneNumber: '',
        },
        editContactData: {
            id: '',
            name: '',
            phoneNumber: '',
        },
        deleteContactData: {
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

    editContact(id, name, phoneNumber) {
        this.setState({
            editContactData: {
                id,
                name,
                phoneNumber,
            },
            editContactModal: !this.state.editContactModal
        })
    }

    deleteContact(id, name, phoneNumber) {
        console.log(id, name, phoneNumber);
        this.setState({
            deleteContactData: {
                id,
                name,
                phoneNumber,
            },
            deleteContactModal: !this.state.deleteContactModal
        })
    }

    editContactReq() {
        axios.put('http://localhost:9090/changeContact',
            qs.stringify({
                "id": this.state.editContactData.id,
                "name": this.state.editContactData.name,
                "phoneNumber": this.state.editContactData.phoneNumber
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        ).then(() =>
            axios.get('http://localhost:9090/getContacts').then((response) => {
                this.setState({
                    persons: response.data,
                    editContactModal: false
                })
            })
        ).catch(error => {
            if (error.response.status === 404) {
                this.setState({
                    messageEdit: "Request not found",
                    persons: this.state.persons, editContactData: {
                        id: this.state.editContactData.id,
                        name: this.state.editContactData.name,
                        phoneNumber: this.state.editContactData.phoneNumber,
                    },
                    editContactModal: true
                })
            } else {
                this.setState({
                    messageEdit: error.response.data,
                    persons: this.state.persons, editContactData: {
                        id: this.state.editContactData.id,
                        name: this.state.editContactData.name,
                        phoneNumber: this.state.editContactData.phoneNumber,
                    },
                    editContactModal: true
                })
            }
        })
    }

    addContact() {
        let param = qs.stringify({
            "name": this.state.newContactData.name,
            "phoneNumber": this.state.newContactData.phoneNumber
        })
        console.log(param)
        axios.post('http://localhost:9090/addContact',
            param, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(() =>
            axios.get('http://localhost:9090/getContacts').then((response) => {
                this.setState({
                    messageAdd: "Add contact",
                    persons: response.data, newContactData: {
                        name: '',
                        phoneNumber: '',
                    },
                    newContactModal: false
                })
            })
        ).catch(error => {
            if (error.response.status === 404) {
                this.setState({
                    messageAdd: "Request not found",
                    persons: this.state.persons,
                    newContactData: this.state.newContactData,
                    newContactModal: true
                })
            } else {
                this.setState({
                    messageAdd: error.response.data,
                    persons: this.state.persons,
                    newContactData: this.state.newContactData,
                    newContactModal: true
                })
            }
        })
    }

    findContactByName() {
        axios.get('http://localhost:9090/findByName', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                "filter": this.state.findContactData
            }
        }).then((response) => {
            this.setState({
                messageFind: "Find contact",
                persons: response.data,
                findContactData: '',
                findContactModal: false
            })
        }).catch(error => {
            if (error.response.status === 404) {
                this.setState({
                    messageFind: "Request not found",
                    persons: this.state.persons,
                    findContactData: this.state.findContactData,
                    findContactModal: true
                })
            } else {
                this.setState({
                    messageFind: error.response.data,
                    persons: this.state.persons,
                    findContactData: this.state.findContactData,
                    findContactModal: true
                })
            }
        })
    }

    findContactByPhone() {
        axios.get('http://localhost:9090/findByPhone', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                "filter": this.state.findContactData
            }
        }).then((response) => {
            this.setState({
                messageFind: "Find contact",
                persons: response.data,
                findContactData: '',
                findContactModal: false
            })
        }).catch(error => {
            if (error.response.status === 404) {
                this.setState({
                    messageFind: "Request not found",
                    persons: this.state.persons,
                    findContactData: this.state.findContactData,
                    findContactModal: true
                })
            } else {
                this.setState({
                    messageFind: error.response.data,
                    persons: this.state.persons,
                    findContactData: this.state.findContactData,
                    findContactModal: true
                })
            }
        })
    }

    deleteContactReq() {
        let param = qs.stringify({
            "id": this.state.deleteContactData.id,
            "name": this.state.deleteContactData.name,
            "phoneNumber": this.state.deleteContactData.phoneNumber
        })
        axios.delete('http://localhost:9090/deleteContact',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    "id": this.state.deleteContactData.id,
                    "name": this.state.deleteContactData.name,
                    "phoneNumber": this.state.deleteContactData.phoneNumber
                }
            }
        ).then(() =>
            axios.get('http://localhost:9090/getContacts').then((response) => {
                this.setState({
                    persons: response.data,
                    deleteContactModal: false
                })
            })
        ).catch(error => {
            if (error.response.status === 404) {
                this.setState({
                    messageDelete: "Request not found",
                    persons: this.state.persons, deleteContactData: {
                        id: this.state.deleteContactData.id,
                        name: this.state.deleteContactData.name,
                        phoneNumber: this.state.deleteContactData.phoneNumber,
                    },
                    deleteContactModal: true
                })
            } else {
                this.setState({
                    messageDelete: error.response.data,
                    persons: this.state.persons, deleteContactData: {
                        id: this.state.deleteContactData.id,
                        name: this.state.deleteContactData.name,
                        phoneNumber: this.state.deleteContactData.phoneNumber,
                    },
                    deleteContactModal: true
                })
            }
        })
    }

    goBack() {
        axios.get('http://localhost:9090/getContacts').then((response) => {
            this.setState({
                messageAdd: "Add new contact",
                messageEdit: "Edit contact",
                messageFind: "Find contact",
                messageDelete: "Delete contact",
                persons: response.data,
                newContactData: {
                    name: '',
                    phoneNumber: '',
                },
                editContactData: {
                    id: '',
                    name: '',
                    phoneNumber: '',
                },
                findContactData: '',
                newContactModal: false,
                editContactModal: false,
                findContactModal: false,
            })
        })
    }

    componentDidMount() {
        axios.get('http://localhost:9090/getContacts').then((response) => {
            this.setState({
                persons: response.data
            })
        })
    }

    toggleNewContactModal() {
        this.setState({
            newContactModal: !this.state.newContactModal,
            messageAdd: "Add new contact",
        })
    }

    toggleEditContactModal() {
        this.setState({
            editContactModal: !this.state.editContactModal,
            messageEdit: "Edit contact",
        })
    }

    toggleDeleteContactModal() {
        this.setState({
            deleteContactModal: !this.state.deleteContactModal,
            messageDelete: "Delete contact",
        })
    }

    toggleFindContactModal() {
        this.setState({
            findContactModal: !this.state.findContactModal,
            messageFind: "Find contact"
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
                    <ModalHeader toggle={this.toggleNewContactModal.bind(this)}>{this.state.messageAdd}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Contact name</Label>
                            <Input name="name" value={this.state.newContactData.name} onChange={(e) => {
                                let newContactData = this.state.newContactData;
                                newContactData.name = e.target.value;
                                this.setState({newContactData});
                            }}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Phone number</Label>
                            <Input name="phoneNumber" value={this.state.newContactData.phoneNumber} onChange={(e) => {
                                let newContactData = this.state.newContactData;
                                newContactData.phoneNumber = e.target.value;
                                this.setState({newContactData});
                            }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.addContact.bind(this)}>Add new
                            contact</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewContactModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.editContactModal} toggle={this.toggleEditContactModal.bind(this)}>
                    <ModalHeader toggle={this.toggleEditContactModal.bind(this)}>{this.state.messageEdit}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Contact name</Label>
                            <Input name="name" value={this.state.editContactData.name} onChange={(e) => {
                                let editContactData = this.state.editContactData;
                                editContactData.name = e.target.value;
                                this.setState({editContactData});
                            }}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Phone number</Label>
                            <Input name="phoneNumber" value={this.state.editContactData.phoneNumber} onChange={(e) => {
                                let editContactData = this.state.editContactData;
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
                        toggle={this.toggleDeleteContactModal.bind(this)}>{this.state.messageDelete}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">{this.state.deleteContactData.name}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">{this.state.deleteContactData.phoneNumber}</Label>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteContactReq.bind(this)}>Delete
                            contact</Button>{' '}
                        <Button color="secondary" onClick={this.toggleDeleteContactModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.findContactModal} toggle={this.toggleFindContactModal.bind(this)}>
                    <ModalHeader toggle={this.toggleFindContactModal.bind(this)}>{this.state.messageFind}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="filter">Filter</Label>
                            <Input name="filter" value={this.state.findContactData} onChange={(e) => {
                                let findContactData = this.state.findContactData;
                                findContactData = e.target.value;
                                this.setState({findContactData});
                            }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary"
                                onClick={this.findContactByName.bind(this)}>Find
                            contact by name</Button>{' '}
                        <Button color="primary"
                                onClick={this.findContactByPhone.bind(this)}>Find
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

export default App;
