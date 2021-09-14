const Boom = require("@hapi/boom");
// const { v4 } = require('uuid');

module.exports = db => {
    const updateUser = async (firstName, lastName, films, email, reqType) => {
        // const id = v4();
        const docRef = db.collection('users').doc(email);

        if (reqType === "POST") {
            const doc = await docRef.get()
            if (doc.exists) throw Boom.conflict('Document already exists')
        }

        return docRef.set({
            email,
            films,
            firstName,
            lastName,
        });
    }

    const getUserById = async id => {
        const docRef = db.collection('users').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) throw Boom.notFound(`Document with id ${id} doesn't exist`)

        return doc.data();
    }

    const delUserById = async id => {
        const docRef = db.collection('users').doc(id);
        const doc = await docRef.delete();

        return 'User Successfully Deleted'
    }

    return { delUserById, getUserById, updateUser }

};
