import express from 'express'

import authController from '../api/auth/controller/authenticate'
import authValidator from '../api/auth/validator/authenticate'

import { countryController } from '../api/country/controller/country'
import countryValidator from '../api/country/validator/country'

class MainRoutes {
  public router: express.Router = express.Router()

  constructor() {
    this.initAuth()
    this.initCountries()
  }

  private initAuth() {
    this.router.post('/auth', authValidator.validateLogin, authController.login)
    this.router.get('/auth/profile', authController.profile)
  }

  private initCountries() {
    this.router
      .get('/country', countryController.getAllCountry)
      .post(
        '/country',
        countryValidator.validateCountry,
        countryController.createCountry,
      )

    this.router
      .get('/country/:id', countryController.getCountry)
      .put(
        '/country/:id',
        countryValidator.validateCountry,
        countryController.updateCountry,
      )
      .delete('/country/:id', countryController.deleteCountry)
  }
}

export const mainRoutes = new MainRoutes().router
