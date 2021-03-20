import bcrypt from 'bcrypt';

export const hash = (data: string): Promise<string> => new Promise((resolve, reject) => {
  bcrypt.genSalt((error, saltRounds) => {
    if (error) {
      return reject(error);
    }

    bcrypt.hash(data, saltRounds, (hashError, hashValue) => {
      if (hashError) {
        return reject(hashError);
      }

      return resolve(hashValue);
    });
  });
});

export const compare = (data: string, based: string): Promise<boolean> => new Promise((resolve, reject) => {
  bcrypt.compare(data, based, (error, result) => {
    if (error) {
      return reject(false);
    }

    return resolve(result);
  })
});
