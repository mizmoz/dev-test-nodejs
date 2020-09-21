module.exports = {
    PORT: process.env.PORT,
    DB: process.env.DB,
    DB_OPTIONS : {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
}
