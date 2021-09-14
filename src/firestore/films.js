const Boom = require("@hapi/boom");

module.exports = db => {
    const updateFilm = async (title, description, releaseDate, reqType) => {
        const id = `${title.replace(' ', '-')}-${releaseDate}`
        const docRef = db.collection('films').doc(id);

        if (reqType === "POST") {
            const doc = await docRef.get()
            if (doc.exists) throw Boom.conflict('Document already exists')
        }


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
        await docRef.delete();

        return 'Document Deleted'
    }

    return { delFilmById, getFilmById, updateFilm }

};
