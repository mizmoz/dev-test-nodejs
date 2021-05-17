import { RequestHandler } from 'express';

const API_USERNAME = process.env.API_USERNAME || "api-user";
const API_PASSWORD = process.env.API_PASSWORD || "Vp9RFY2wQ2cXLyvn";

export const checkAuth : RequestHandler = async (req, res, next) => {
  const { query } = req;

  if(query.username == API_USERNAME && query.password == API_PASSWORD){
   next();
  }
  else{
   return res.status(401).json({ status : false, message: 'Authentication failed! Please check your information' });
  }
};
