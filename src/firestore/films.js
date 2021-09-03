// import { v4 as uuidv4 } from 'uuid';
// const { v4 } = require('uuid');

module.exports = db => {
    const addFilm = async (title, description, releaseDate) => {
        // const uuid = v4();
        const uuid = `${title.replace(' ', '-')}-${releaseDate}`

        const docRef = db.collection('films').doc(uuid);

        await docRef.set({
            title,
            description,
            releaseDate,
        });
    }

    return { addFilm }

};
