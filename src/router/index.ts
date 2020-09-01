import express from 'express'
import BaseRouter from './base.router';
import CountryRouter from './country.router'

class MainRouter extends BaseRouter {
    constructor(){
        super();
        let _router = this.getRouter();
        _router.use('/country', CountryRouter.getRouter());
    }
    
}

export default new MainRouter();