const jwt = require('jsonwebtoken');
const db = require('../models');
const Message = db.messages;

// Pour chaque requête sur une route protégée on passe d'abord par ce middleware :
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, process.env.TKN_SECRET);
		const userId = decodedToken.userId;

		Message.findOne({ _id: req.params.id })
			.then(message => {
				console.log(userId);
				console.log(message.UserId);
				if (userId === message.UserId) {
					next();
				} else {
					throw 'User ID non propriétaire !';
				}
				res.status(200).json(message);
			})

			.catch(error => res.status(404).json({ error }));
	} catch (error) {
		res.status(403).json({ error: error | 'Requête non approuvé !' });
	}
};
