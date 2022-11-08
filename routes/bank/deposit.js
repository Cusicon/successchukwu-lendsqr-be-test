const { Router } = require('express');
const jwtVerify = require('../../utils/jwtVerify');
const router = Router();

// --( DB )--
const knex = require('../../db/dbconnect');

// POST: deposit money
router.get('/', jwtVerify, async (req, res) => {
	const knexUser = knex('users');

	try {
		const found_user_data = await knexUser.where('id', req.user.id);
		let found_user = found_user_data[0];

		req.cleanBody(['fullname', 'account_no'], found_user);

		if (!found_user)
			return res.json({
				status: res.statusCode == 500,
				error: {
					message: 'No user found!',
				},
				data: null,
			});

		return res.json({
			message: 'Deposit now!',
			error: null,
			data: { user: found_user },
		});

		return;
	} catch (err) {
		return res.json({
			...global.jsonBag,
			status: (res.statusCode = err.status || 500),
			error: {
				message: err.message,
				data: { ...err },
			},
			data: null,
		});
	}
});

module.exports = router;
