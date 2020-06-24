import mongoose, { Document, Schema } from "mongoose";
import { ICountry } from "../types";

const CountrySchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  population: { type: Number, required: true, unique: false },
});

export default mongoose.model<ICountry & Document>("Country", CountrySchema);
