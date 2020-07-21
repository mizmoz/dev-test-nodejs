import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';

export default function EditForm(props) {
    const initialForm = {
        code : '',
        name : '',
        population : ''
    }

    let [country, setCountry] = useState(initialForm);

    let handleInputChanges = (e) => {
        const {name, value} = e.target;
        setCountry({...country, [name] : value});
    }

    let handleSubmit = () => {
        if(!country.name || (!country.population && country.population != 0)) return
        props.sendUpdate(country.code, country)
    }

    useEffect(() => {
        setCountry(props.countryData);
        console.log("*********** props",props, country);
    }, [props])

    let buttonStyle = {
        margin : "25px"
    }
    return (
        <Card className="box-shadow">
            <Card body>
            <Card.Title className="text-center">Edit Country</Card.Title>
            <form>
                <div className="form-group">
                    <div className="">
                        <span>Name : </span><input type="text" name="name" className="form-control" value={country.name} onChange={e => handleInputChanges(e)}/>
                    </div>
                    <div className="">
                        <span>Populations : </span><input type="number" name="population" className="form-control" value={country.population} onChange={e => handleInputChanges(e)}/>
                    </div>
                    <div className="btn-group">
                        <div><input type="button" value="Save Changes" className="btn btn-success" style={buttonStyle} onClick={e => handleSubmit()}/></div>
                        <div><input type="button" value="Cancel" className="btn btn-outline-success"  style={buttonStyle} onClick={e => props.disableEditing()}/></div>
                    </div>
                </div>
            </form>
            </Card>
        </Card>
    )
}
