// import { v4 as uuidv4 } from 'uuid';
// const { v4 } = require('uuid');

const Boom = require("@hapi/boom");

module.exports = db => {
    const updateFilm = async (title, description, releaseDate, reqType) => {
        const id = `${title.replace(' ', '-')}-${releaseDate}`

        if (reqType === "POST") {
            const doc = await db.collection('films').doc(id).get()
            if (doc.exists) throw Boom.conflict('Document already exists')
        }

        const docRef = db.collection('films').doc(id);

        return docRef.set({
            title,
            description,
            releaseDate,
        });
    }

    const getFilmById = async id => {
        const docRef = db.collection('films').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) throw Boom.notFound(`Document with id ${id} doesn't exist`)

        return doc.data();
    }

    const delFilmById = async id => {
        const docRef = db.collection('films').doc(id);
        const doc = await docRef.delete();
        console.log(doc)

        return 'doc.data();'
    }

    return { delFilmById, getFilmById, updateFilm }

};
