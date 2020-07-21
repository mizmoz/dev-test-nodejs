import redis from 'redis';

let REDIS_PORT = process.env.PORT || 6379;

export let client = redis.createClient(+REDIS_PORT);
export let redisMod = redis;

export let getAllData = async() => {
    return new Promise((resolve, reject) => {
        client.keys('*', async (err, keys) => {
            if(!err) {
                let allPromises = await loopKeys(keys);
                Promise.all(allPromises).then((values) => {
                    values.sort((a: any, b: any) => {
                        return b.population - a.population;
                    });
                    resolve(values);
                })
            }
        })
    })
}    

export let loopKeys = async(keys: string[]): Promise<[]> => {
    let promisess: any = [];
    keys.map((key) => {
        promisess.push(
            new Promise((resolve, reject) => {
                client.get(key, (err, resp) => {
                    let textObj: any = resp;
                    resolve(JSON.parse(textObj));
                })
            })
        )
    })
    return promisess;
}