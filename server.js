const express = require('express');
const cors = require('cors');

const apiRouter = require('./app/routes');

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:8081',
        'http://localhost:5173', // vite
        'http://localhost:3003', // astro
        'http://localhost:3929', // for next
        'https://trendy-store-vite.vercel.app',
    ],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

const db = require('./app/models');

db.sequelize
    .sync()
    .then(() => {
        console.log('Synced db.');
    })
    .catch(err => {
        console.log(`Failed to sync db: ${err.message}`);
    });

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use('/api-auth/', apiRouter());

// set port, listen for requests
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
