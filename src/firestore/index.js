const admin = require('firebase-admin');
const filmsDb = require('./films');

const serviceAccount = require('../../wanna-watch-firebase-adminsdk-5tuo2-d667dcebee.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wanna-watch-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();

module.exports = {
    films: filmsDb(db)
}