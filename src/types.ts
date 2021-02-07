import mongoose from 'mongoose';


export interface Country {
  name: string;
  code: string;
}

export interface ICountry extends mongoose.Document {
	name: String;
	code: String;
}

export class CountrySchema{
	name: String;
	code: String;
}
