import express from 'express'

class BaseRouter {
    private _router = express.Router();
    
    constructor(){
        // this._name = name;
    }
    
    public getRouter(){
        return this._router;
    }
}

export default BaseRouter;