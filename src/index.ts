import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import redis from 'redis';
import { ICountry, CountrySchema } from './types';
import countryAPI from './api/country';
import { auth } from './middleware/auth';

// rest of the code remains same
const app = express();
const PORT = 8000;

const countrySchema = new mongoose.Schema({
	name: String,
	code: String,
	population: Number
});
const Country = mongoose.model<ICountry>('Country', countrySchema);

app.use(auth);
app.use(bodyParser.urlencoded({
	extended: true
}));

mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'countries',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) : console.log('Connected to the MongoDB') );

mongoose.connection.on('connected',function () { 
	mongoose.connection.db.collection('countries').countDocuments((err,count)=>{
		if( count === 0 ) {
			countryAPI().then( (clist:any) => {
				for (let key in clist) {
					clist[key].population = Math.floor( Math.random() * 9999999999 );
				}

				Country.collection.insert(clist, function(err, docs){
					if (err) {
						console.log('Country Saving Error', err);
					} else {
						console.log('Country has been saved',docs);
					}
				});
			} );
		}
	}); 
});

//get country list
app.get('/country', (req, res) => {
	countryAPI().then( (clist:any) => {
		return res.status(200).json(
			clist
		);
	} );
});

//get country list sorted by population
app.get('/country/sort-by-population', (req, res) => {
	Country.find({}).sort({population: 'desc'}).exec((err, docs) => {
		if( err ) {
			return res.status(400).json({
				error: err
			});
		} else {
			return res.status(200).json(
				docs
			);
		}
	});
});

//get country list
app.post('/country/:id', async (req, res) => {
	const id = req.params.id;
	const country_name = req.body.country_name;
	const country_code = req.body.country_code;
	const country_population = req.body.country_population;
	let country = await Country.findOneAndUpdate({_id: id},{
		name: country_name,
		code: country_code,
		population: country_population
	});

		if( !country ) {
			return res.status(400).json({
				error: 'No matching item'
			});
		} else {
			return res.status(200).json(
				country
			);
		}
});

//get country list
app.delete('/country/:id', async (req, res) => {
	const id = req.params.id;
	Country.deleteOne({_id: id}).exec(( err )=>{
		if( err ) {
			return res.status(400).json({
				error: err
			});
		} else {
			return res.status(200).json(
				{message: 'Successfully Deleted'}
			);
		}
	});
});

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

const client = redis.createClient('redis://127.0.0.1:6379');
client.on("error", (err) => {
    console.error(err);
});