import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavbarBrand from 'react-bootstrap/NavbarBrand';
import NavbarToggle from 'react-bootstrap/NavbarToggle';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';

import Button from 'react-bootstrap/Button';

import axios from 'axios';

export class Header extends Component {
    logout() {
        axios.post("/logout")
    }
    render() {
        return (
            <React.Fragment>
                <Navbar className="navbar-light navbar-expand-md bg-light sticky-top">
                    <NavbarBrand>Countries Population</NavbarBrand>
                    <NavbarToggle data-toggle="collapse" data-target="#navbarResponsive">
                        <span className="navbar-toggler-icon"></span>
                    </NavbarToggle>
                    <NavbarCollapse id="navbarResponsive">
                        <ul className="navbar-nav ml-auto">
                            <NavItem>
                                <NavLink className="active">Hi USER</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/logout">Logout</NavLink>
                            </NavItem>
                        </ul>
                    </NavbarCollapse>
                </Navbar>

                <hr/>
            </React.Fragment>
            
        )
    }
}

export default Header
