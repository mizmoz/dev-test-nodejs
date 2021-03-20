import config from 'config';

import Service from './service';

const port = config.get<number>('port') || 3000; 

// tslint:disable-next-line: no-console
Service.listen(port, () => console.log(`App running in port ${port}`));
