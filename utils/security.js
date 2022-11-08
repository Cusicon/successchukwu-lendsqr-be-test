const bcrypt = require('bcryptjs');

const knex = require('../db/dbconnect');

// Ask for pin before proceeding
const authUserByPin = async (req, res, next) => {
	const knexUser = knex('users');

	const { auth_pin } = req.body;

	try {
		const logged_in_user_data = await knexUser.where('id', req.user.id);
		let logged_in_user = logged_in_user_data[0];

		req.cleanBody(['pin'], logged_in_user);

		if (await bcrypt.compare(auth_pin, logged_in_user.pin)) return next();

		return res.json({
			...global.jsonBag,
			error: {
				message: 'Wrong pin!',
				data: null,
			},
			data: null,
		});
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
};

module.exports = { authUserByPin };
