import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

const secret = config.get<string>('secret') || 'dummy';

export const sign = (data: any): Promise<string> => new Promise((resolve, reject) => {
  jsonwebtoken.sign(data, secret, (error: any, token: any) => {
    if (error) {
      return reject(error);
    }

    return resolve(token);
  });
})

export const verify = (token: string): Promise<any> => new Promise((resolve, reject) => {
  jsonwebtoken.verify(token, secret, (error: any, decoded: any) => {
    if (error) {
      return reject(error);
    }

    return resolve(decoded);
  });
});
