const jwt = require('jsonwebtoken');

// --( DB )--
const knex = require('../db/dbconnect');

module.exports = async (req, res, next) => {
	const knexUser = knex('users');

	const auth_header = req.headers.authorization;
	const token = auth_header && auth_header.split(' ')[1];

	// If there is no token, return an error
	if (!token)
		return res.json({
			...global.jsonBag,
			error: {
				message: 'Sorry, no token sent!',
				data: null,
			},
			data: null,
		});

	// If token is found, get user.id from JWT and
	// find user's proper info from DB
	try {
		let user_payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

		let found_user_data = await knexUser.where('id', user_payload.id);
		let found_user = found_user_data[0];
		req.cleanBody(
			['id', 'role', 'fullname', 'account_no', 'avatar'],
			found_user,
		);

		// If there is no user, return an error
		if (!found_user)
			return res.json({
				...global.jsonBag,
				error: {
					message: 'Sorry, no user found!',
					data: null,
				},
				data: null,
			});

		found_user.name = {
			first: `${found_user.fullname.split(' ')[0]}`,
			last: `${found_user.fullname.split(' ')[1]}`,
		};
		req.user = { ...found_user };
	} catch (err) {
		return res.json({
			...global.jsonBag,
			error: {
				message: err.message,
				data: { ...err },
			},
			data: null,
		});
	}
	next();
};
