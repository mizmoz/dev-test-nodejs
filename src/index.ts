import { app } from './app';

const { PORT = 3000, HOST = "localhost" } = process.env;

app.listen(PORT, () => console.log(`Server started at http://${HOST}:${PORT}`));