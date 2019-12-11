module.exports = {
    app: {
        port: 3333,
        env: process.env.NODE_ENV,
        hostname: 'http://localhost:3333',
        uploadDir: __dirname + '/public/uploads'
    },
    db: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        name: 'nem',
        debug: true
    }
}