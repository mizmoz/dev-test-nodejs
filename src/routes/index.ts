import {Router, Request, Response, NextFunction, response} from 'express';
import passport from 'passport';
import { isAuthenticated as auth } from '../api/authentication'

const router = Router();

router.get('/', async (req: Request, res : Response) => {
    res.redirect('/main');
})

router.get('/login', async (req:Request, res:Response) => {
   res.render("login")
})

router.get('/main', auth, async (req:Request, res:Response) => {
    const username = "username";
    res.render("main", {
        username
    })
 })

router.post('/login', (req:Request, res:Response, next:NextFunction) => {
    passport.authenticate('local', {
        successRedirect: '/main',
        failureRedirect: '/login'
    })(req, res, next);
})

router.get('/logout', (req:Request, res:Response) => {
    if(req.isAuthenticated()) req.logOut();
    res.redirect("/login");

})

export = router
    
