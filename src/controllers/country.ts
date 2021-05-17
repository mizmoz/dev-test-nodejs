import { RequestHandler } from 'express';
import * as Redis from '../redis';
import * as CountryRepository from "../repositories/country"

export const migrate : RequestHandler = async (req, res, next) => {
  try {
   await CountryRepository.removeAll();
   await CountryRepository.migrate();

   return res.status(201).json({ status : true, message: 'The migration finished successfully' });
 } catch (ex) {
   return res.status(500).json({ status : false, message : ex.message });
 }
};

export const list : RequestHandler = async (req, res, next) => {
  const { query } = req;

  try {
    const data  = await CountryRepository.list(((query.sort) ? query.sort : 'asc'));
    return res.status(200).json({ status : true, data });
  } catch (ex) {
    return res.status(500).json({ status : false, message : ex.message });
  }
};

export const update : RequestHandler = async (req, res, next) => {
  const { code, population } = req.body;

  try {
    await CountryRepository.update(code, population);
    return res.status(200).json({ status : true, message : 'The country updated successfully.' });
  } catch (ex) {
    return res.status(500).json({ status : false, message : ex.message });
  }

  return res.status(200).json([]);
};

export const remove : RequestHandler = async (req, res, next) => {
  const { code } = req.body;

  try {
    await CountryRepository.remove(code);
    return res.status(200).json({ status : true, message : 'The country removed successfully.' });

  } catch (ex) {
    return res.status(500).json({ status : false, message : ex.message });
  }

  return res.status(200).json([]);
};
