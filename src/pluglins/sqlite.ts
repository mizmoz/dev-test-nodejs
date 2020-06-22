import { DB, Country } from '../types';
import sqlite from 'sqlite3';
let _db = new sqlite.Database('./countries.db');

const db = (): DB => {
  const init = (data: Array<Country>) => {
    _db.serialize(function () {
      _db
        .run(`CREATE TABLE IF NOT EXISTS countries (
          code VARCHAR(3) PRIMARY KEY, 
          name VARCHAR(250) UNIQUE NOT NULL,
          population BIGINT
        )`)
        .get(`SELECT COUNT(*) as records FROM countries`, [], (err, row) => {
          if (err) {
            throw new Error(`Table creation failed: ${err.message}`)
          }

          if (row.records < 1) {
            const stmt = _db.prepare("INSERT INTO countries (code,name,population) VALUES (?,?,?)");

            for (var i = 0; i < data.length; i++) {
              stmt.run([data[i].code, data[i].name, 0]);
            }

            stmt.finalize();
          }
        })
    });

    const fetchAll = (): Promise<Array<Country>> => {
      return new Promise((res) => {
        _db.serialize(function () {
          _db.all('SELECT * FROM countries',
            []
            , (err: Error, rows: any) => {
              if (err) {
                console.log('Fetching countries failed', err.message)
                res([])
              }

              res(rows)
            });
        });
      })
    }

    const fetchAllByPopulation = (): Promise<Array<Country>> => {
      return new Promise((res) => {
        _db.serialize(function () {
          _db.all('SELECT * FROM countries ORDER BY population DESC',
            []
            , (err: Error, rows: any) => {
              if (err) {
                console.log('Fetching countries by population failed', err.message)
                res([])
              }

              res(rows)
            });
        });
      })
    }

    const updatePopulation = (code: string, population: number): Promise<Boolean> => {
      return new Promise((res) => {
        _db.serialize(function () {
          _db.get(`UPDATE countries SET population=? WHERE code=?`,
            [population, code],
            (err: Error, rows: any) => {
              if (err) {
                console.log('Updating population failed', err.message)
                res(false)
              }

              res(true)
            });
        });
      })
    }

    const updateCountry = (code: string, target: string, value: string | number): Promise<Country | null> => {
      const key = target === 'code' ? value : code;

      return new Promise((res) => {
        _db.serialize(function () {
          _db
            .run(`UPDATE countries SET ${target}=? WHERE code=?`,
              [value, code],
              (err: Error | null) => {
                if (err) {
                  console.log('Updating population failed', err.message)
                  res(null)
                }
              })
            .get(`SELECT * FROM countries WHERE code=?`,
              [key],
              (err: Error, row: any) => {
                if (err) {
                  console.log('Updating population failed', err.message)
                  res(null)
                }

                res(row)
              }
            )
        });
      })
    }

    const deleteCountry = (code: string): Promise<Boolean> => {
      return new Promise((res) => {
        _db.serialize(function () {
          _db.run(`DELETE FROM countries WHERE code=?`,
            [code],
            (err: Error) => {
              if (err) {
                console.log('Deletion of country unsuccessful:', err.message)
                res(false)
              }

              res(true)
            })
        })
      })
    }

    return {
      fetchAll,
      fetchAllByPopulation,
      updatePopulation,
      updateCountry,
      deleteCountry,
    };
  }

  return {
    init
  }
}

export default db()