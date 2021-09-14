const admin = require('firebase-admin');
const filmsDb = require('./films');
const usersDb = require('./users');

const serviceAccount = require('../../secrets/wanna-watch-firebase-adminsdk-5tuo2-d85cb4dfda.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wanna-watch-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

module.exports = {
    films: filmsDb(db),
    users: usersDb(db),
}