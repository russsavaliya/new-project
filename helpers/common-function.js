const ObjectId = require('mongoose').Types.ObjectId;

exports.isValidObjectId = (id) => {
    if (id && ObjectId.isValid(id)) {
        return (String)(new ObjectId(id)) === id;
    }
    return false;
}

exports.makeId = function (length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}