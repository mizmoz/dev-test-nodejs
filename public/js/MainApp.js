import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Header from './Header';
import Modal from './Modal';
import EditForm from './EditForm';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function MainApp() {
    let initialData = {
        code : '',
        name : '',
        population : ''
    }
    let [modalOpen, openModal] = useState(false)
    let [activeData, setActiveData] = useState(initialData)

    let [editing, setEditingMode] = useState(false);
    let [countryList, setCountryList] = useState([]);

    const toggleModal = () => {
        console.log("********",modalOpen);
        openModal(!modalOpen);
    }

    const enableDelete = (data) => {
        setActiveData(data);
        toggleModal();
    }

    const enableEditing = (data) => {
        setActiveData(data);
        setEditingMode(true);
    }

    const disableEditing = () => {
        setEditingMode(false)
    }

    const sendUpdate = (code, data) => {
        Axios({
            method : "PUT",
            url : "/api/updateCountry/code",
            data
        })
        .then(response => setCountryList(response.data))
        .catch(error => console.log(error))


        disableEditing();
        setActiveData(initialData);
    }

    const deleteCountry = () => {
        Axios({
            method : "DELETE",
            url : "/api/deleteCountry/"+activeData.code
        })
        .then(response => setCountryList(response.data))
        .catch(error => console.log(error))

        toggleModal();
        setActiveData(initialData);
    }

    useEffect(() => {
        Axios({
            method : "GET",
            url: "/api/getAllCountries"
        })
        .then(response => {
            let data = response.data;
            setCountryList(data);
        })
        .catch(err => console.log("error", error))
    }, [])

    return (
        <React.Fragment>
           
            {modalOpen ? <Modal show={true}
                    data={activeData}
                    toggleModal={toggleModal}
                    deleteCountry={deleteCountry}
                /> : ''
            } 
            <Header />
            <Container>
                {editing ? <EditForm 
                    countryData = {activeData}
                    sendUpdate = {sendUpdate}
                    disableEditing = {disableEditing}
                 /> : ''
                }
                <hr />
                <Card className="box-shadow">
                    <Card body>
                        <Card.Title className="text-center">Country List</Card.Title>
                        <Table responsive bordered striped hover>
                            <thead>
                                <tr>
                                    <th>Country Code</th>
                                    <th>Name</th>
                                    <th>Populations</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        countryList?.map((country) => {
                                            return <tr key={country.code}>
                                                <td className="text-center">{country.code.toUpperCase()}</td>
                                                <td>{country.name}</td>
                                                <td>{country.population}</td>
                                                <td>
                                                    <Button variant="primary" onClick={e => {enableEditing(country)}}>Edit</Button> {' '}
                                                    <Button variant="danger" onClick={e => {enableDelete(country)}}>Delete</Button> {' '}
                                                </td>
                                            </tr>

                                        })
                                    }
                            </tbody>
                        </Table>
                    </Card>
                    
                </Card>
            </Container>
        </React.Fragment>
    )
}