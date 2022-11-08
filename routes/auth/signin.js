const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --( FILE VARIABLES )--
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

// --( DB )--
const knex = require('../../db/dbconnect');

router.post(
	'/',
	// account number must not be empty
	body('account_no', 'Please, enter a valid account number!')
		.notEmpty()
		.isString(),
	// password must be at least 5 chars long
	body('password', 'Please, enter a password!').notEmpty().isString(),
	async (req, res) => {
		const knexUser = knex('users');

		let original_password = req.body.password;
		req.body = JSON.parse(JSON.stringify(req.body).toLowerCase());
		req.body.password = original_password;

		const errors = validationResult(req);
		const { account_no, password } = req.body;

		// Checking for Errors
		if (!errors.isEmpty())
			return res.json({
				...global.jsonBag,
				status: (res.statusCode = 400),
				error: {
					message: "Hello? You've entered some invalid fields!",
					data: errors.array(),
				},
				data: null,
			});

		try {
			const userData = await knexUser.where('account_no', account_no);
			let user = userData[0];

			req.cleanBody(['id', 'account_no', 'email', 'password'], user);

			if (!user)
				return res.json({
					...global.jsonBag,
					error: {
						message: 'Sorry, Invalid credentials!',
						data: null,
					},
					data: null,
				});

			if (await bcrypt.compare(password, user.password)) {
				// Create and sign token
				const token = jwt.sign(
					{ id: user.id, email: user.email },
					JWT_ACCESS_TOKEN_SECRET,
				);

				// the email and password combination is successful and token is...
				// returned as data to the client to save
				return res.json({
					...global.jsonBag,
					message: 'Yay, login successful!',
					error: null,
					data: { token },
				});
			}

			return res.json({
				...global.jsonBag,
				error: {
					message: 'Sorry, Invalid credentials!',
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
	},
);

module.exports = router;
