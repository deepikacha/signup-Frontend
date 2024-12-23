const express = require('express')
const bodyparser = require('body-parser');
const cors = require('cors')
const path = require('path');
const sequelize = require('./util/database');
const userRoutes = require('./routes/userRoutes')

const app = express();


app.use(cors())
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


app.use(userRoutes)





app.get('*', (req, res, next) => { let requestUrl = req.url; console.log(requestUrl); console.log(__dirname); // Remove query parameters if any
 requestUrl = requestUrl.split('?')[0]; 
 if (requestUrl === '/') { res.sendFile(path.join(__dirname, 'views', 'signup.html'));

  } else { const filePath = path.join(__dirname, 'views', `${requestUrl}.html`); 
  res.sendFile(filePath, (err) => { if (err) { const publicFilePath = path.join(__dirname, 'public', requestUrl);
     res.sendFile(publicFilePath, (err) => { if (err) { next(err); } }); } }); } });
app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
        res.status(err.status || 500).send({
            error: { message: err.message || 'An error occurred', },
        });
    }
});

sequelize.sync()
    .then(() => {
        console.log("Database synced")
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(3000, () => {
    console.log("server running in port http://localhost:3000")
})