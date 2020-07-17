import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@material-ui/core";

interface Country {
  id: string;
  name: string;
  code: string;
  population: string;
}

const useStyles = makeStyles({
  table: {
    width: "100%",
    margin: "auto",
  },
});

const apiHost = "http://username:password@localhost:3000";

export default () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const classes = useStyles();
  const [showUpdateOnIndex, setShowUpdateOnIndex] = useState<number>(-1);
  const [countryValue, setCountryValue] = useState<string>("");
  const [codeValue, setCodeValue] = useState<string>("");
  const [populationValue, setPopulationValue] = useState<string | undefined>(
    "",
  );
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [savingItem, setSavingItem] = useState<number>(0);

  const [sortDirection, setSortDirection] = useState<string>("");

  const axiosOptions = {
    auth: {
      username,
      password,
    },
  };

  useEffect(() => {
    const runAsync = async () => {
      const countriesApi = await axios
        .get(`${apiHost}/countries`, axiosOptions)
        .then(res => res.data);
      setCountries(countriesApi);
    };

    runAsync();
  }, [savingItem]);

  const handleSubmit = async (id: string) => {
    const payload = {
      name: countryValue,
      code: codeValue,
      population: populationValue,
    };

    await axios.post(`${apiHost}/countries/${id}`, payload, axiosOptions);
    setSavingItem(savingItem + 1);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${apiHost}/countries/${id}`, axiosOptions);
    setSavingItem(savingItem + 1);
  };

  const handleSort = async (direction: string) => {
    const countriesApi = await axios
      .get(`${apiHost}/sort/${direction}`, axiosOptions)
      .then(res => res.data);
    setCountries(countriesApi);
  };

  return (
    <div className="App">
      <h1>Enter login credentials to be able to update data</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TextField
          placeholder="Username"
          variant="outlined"
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          type="password"
          placeholder="Password"
          variant="outlined"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {(!username || !password) && (
        <div
          style={{
            color: "red",
            textAlign: "left",
            paddingLeft: 20,
            marginTop: 20,
          }}
        >
          Required to enter credentials above to perform action
        </div>
      )}
      <div style={{ textAlign: "left", paddingLeft: 20, marginTop: 20 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={async () => {
            const currentDirection = !!sortDirection ? sortDirection : "asc";
            await handleSort(currentDirection);
            setSortDirection(currentDirection === "asc" ? "desc" : "asc");
          }}
        >
          SORT{" "}
          {!sortDirection ? "ASC" : sortDirection === "asc" ? "ASC" : "DESC"}
        </Button>
      </div>
      <h1>Click an item to update</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Country Name</TableCell>
              <TableCell align="right">Country Code</TableCell>
              <TableCell align="right">Populations</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map(({ id, name, code, population }, i) => (
              <TableRow
                key={id}
                onClick={() => {
                  if (showUpdateOnIndex === -1) {
                    setShowUpdateOnIndex(i);
                    setCountryValue(name);
                    setCodeValue(code);
                    setPopulationValue(population);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {showUpdateOnIndex === i ? (
                    <TextField
                      value={countryValue}
                      onChange={e => setCountryValue(e.target.value)}
                    />
                  ) : (
                    name
                  )}
                </TableCell>
                <TableCell align="right">
                  {showUpdateOnIndex === i ? (
                    <TextField
                      value={codeValue}
                      onChange={e => setCodeValue(e.target.value)}
                    />
                  ) : (
                    code
                  )}
                </TableCell>
                <TableCell align="right">
                  {showUpdateOnIndex === i ? (
                    <TextField
                      value={populationValue}
                      type="number"
                      onChange={e => setPopulationValue(e.target.value)}
                    />
                  ) : (
                    population
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      setShowUpdateOnIndex(-1);
                      showUpdateOnIndex === i
                        ? handleSubmit(id)
                        : handleDelete(id);
                    }}
                  >
                    {showUpdateOnIndex === i ? "Save" : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
