const db = require('../models');
const Message = db.messages;
const User = db.users;
const Comment = db.comments;

// Routes CRUD : Create, Read, Update, Delete.

// CREATE

exports.createMessage = (req, res, next) => {
	//     if (!req.body.UserId || !req.body.message || !req.body.messageUrl || req.body.message.length > 1500) {
	//         return res.status(400).json({message: "one ore more parameters missing or message too long (max length is 1500"})
	// } else {
	console.log('ligne 14 req.body' + req.body.messageUrl);
	let imagePost = '';
	if (req.file) {
		imagePost = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
	}
	const message = new Message({
		UserId: req.body.UserId,
		message: req.body.message,
		messageUrl: imagePost
	});
	console.log(message);
	message
		.save()
		.then(() => res.status(201).json({ message: 'Publication réussie' }))
		.catch(error => res.status(400).json({ error }));
	//}
};

// READ

exports.findAllMessages = (req, res, next) => {
	Message.findAll({
		include: { model: User, required: true, attributes: ['userName'] },

		order: [['id', 'DESC']]
	})
		.then(messages => {
			const list = messages.map(message => {
				return Object.assign(
					{},
					{
						id: message.id,
						createdAt: message.createdAt,
						message: message.message,
						messageUrl: message.messageUrl,
						UserId: message.UserId,
						userName: message.User.userName,
						isActive: message.User.isActive
					}
				);
			});
			res.status(200).json({ list });
		})
		.catch(error => res.status(400).json({ error }));
};

exports.findOneMessage = (req, res, next) => {
	const oneMessage = {};
	Message.findOne({
		where: { id: req.params.id },
		include: {
			model: User,
			required: true,
			attributes: ['userName']
		},
		order: [['id', 'DESC']]
	})
		.then(message => {
			oneMessage.id = message.id;
			oneMessage.userId = message.UserId;
			oneMessage.userName = message.User.userName;
			oneMessage.createdAt = message.createdAt;
			oneMessage.message = message.message;
			oneMessage.messageUrl = message.messageUrl;
			res.status(200).json(oneMessage);
		})
		.catch(error => res.status(404).json({ error }));
};

exports.findAllMessagesForOne = (req, res, next) => {
	let list = '';
	Message.findAll({
		where: { UserId: req.params.id }
	})
		.then(res => {
			list = res;
			res.status(200).json({ list });
		})
		.catch(error => {
			res.status(404).json({ error });
		});
};

// UPDATE
exports.modifyOneMessages = (req, res, next) => {
	let messageObject = {};
	const body = sanitize(req.body);
	req.file
		? (Message.findOne({ _id: req.params.id })
				.then(message => {
					const filename = message.imageUrl.split('/images/')[1];
					fs.unlinkSync(`images/${filename}`);
				})
				.catch(error => res.status(500).json({ error })),
		  (messageObject = {
				...JSON.parse(body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		  }))
		: (messageObject = { ...body });

	Message.updateOne({ _id: req.params.id }, { ...messageObject, _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Objet modifié !' });
		})
		.catch(error => res.status(400).json({ error }));
};

// DELETE

exports.deleteMessage = (req, res, next) => {
	console.log(' MESSAGE DELETION PROCESS ');
	console.log(' message Id is: ' + req.params.id);

	Comment.destroy({ where: { MessageId: req.params.id } });
	Message.destroy({ where: { id: req.params.id } })
		.then(res => {
			return res.status(200).json({ message: 'Message and its comments have been destroyed' });
		})
		.catch(error => res.status(400).json({ error }));
};
