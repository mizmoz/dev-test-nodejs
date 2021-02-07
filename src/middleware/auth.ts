import authenticate from "../api/authenticate";

export const auth = (req:any, res:any, next:any) => {
	const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
	const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
	// let authenticated:boolean;
	try {
		authenticate(login,password).then((authenticated) => {
			if( authenticated ) {
				next();
			} else {
				console.log('You are not authorized to view this page.');
				res.status(401).send();
			}
		})
	} catch (error) {
		//If token is not valid, respond with 401 (unauthorized)
		res.status(401).send();
		return;
	}

	return;
};