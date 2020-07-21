import React, { Component } from 'react';

import ModalMain from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import Button from 'react-bootstrap/Button';

export class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeData : this.props.data
        }
    }

    onChange(e) {
        this.state.activeData.name = e.target.value;
        this.setState({activeData : this.state.activeData});
    }

    render() {
        let modalBody, button, modalTitle;
            modalTitle = <ModalTitle>Delete Player</ModalTitle>
            modalBody = <ModalBody><span>Are you sure you want to delete player {this.props.data.name}</span></ModalBody>
            button = <Button variant="danger" onClick={e => {this.props.deleteCountry()}}>Delete</Button>
        return (
            <ModalMain show={this.props.show} onHide={e => {this.props.toggleModal()}}>
                <ModalHeader closeButton>
                {modalTitle}
                </ModalHeader>
                {modalBody}
                <ModalFooter>
                    <Button variant="secondary" onClick={e => {this.props.toggleModal()}}>
                        Close
                    </Button>
                    {button}
                </ModalFooter>
            </ModalMain>
        )
    }
}

export default Modal
