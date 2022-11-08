const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// --( DB )--
const knex = require('../../db/dbconnect');

// POST: register a user
router.post(
	'/',
	// firstname must be a string
	body('fullname')
		.notEmpty()
		.isString()
		.custom((value) => {
			// If fullname is not 2 values
			// E.g Success Chukwu
			if (value.split(' ').length < 2)
				throw new Error('Please, enter your fullname!');

			return value;
		}),
	// email must be an email
	body('email', 'Please, enter a valid email!').notEmpty().isEmail(),
	// pin must be 4 chars long
	body('pin', 'Please, Transaction Pin must be 4 digits!')
		.notEmpty()
		.isLength({ min: 4, max: 4 }),
	// password must be at least 5 chars long
	body('password', 'Please, password must be above 5 characters!')
		.notEmpty()
		.isLength({ min: 4, max: 6 }),
	// phone must not be a number and not-empty
	body('phone', 'Phone Number is important!').notEmpty().isNumeric(),
	async (req, res) => {
		const knexUser = knex('users');

		let original_password = req.body.password;
		req.body = JSON.parse(JSON.stringify(req.body).toLowerCase());
		req.body.password = original_password;
		req.cleanBody(['fullname', 'email', 'password', 'phone', 'pin']);

		const errors = validationResult(req);
		const { fullname, password, phone, pin } = req.body;
		let modified_phone = phone;
		let account_no = 0;
		modified_phone = modified_phone.includes('+')
			? modified_phone.replace('+', '')
			: modified_phone;

		if (modified_phone.length >= 11)
			if (modified_phone.charAt(0) == '0') account_no = Number(modified_phone);
			else account_no = modified_phone.split('234')[1];

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

		// Create User
		try {
			let hashed_password = await bcrypt.hash(password, 10);
			let hashed_pin = await bcrypt.hash(pin, 10);
			let avatar = `https://ui-avatars.com/api/?name=${fullname
				.split(' ')
				.join('%20')}
				&background=f36629&color=fce999&size=128&bold=true`;
			req.body = {
				...req.body,
				avatar,
				account_no,
				pin: hashed_pin,
				phone: modified_phone,
				password: hashed_password,
			};

			await knexUser.insert({ ...req.body });

			return res.json({
				...global.jsonBag,
				status: (res.statusCode = 201),
				message: 'Congrats, account created!',
				error: null,
				data: null,
			});
		} catch (err) {
			return res.json({
				...global.jsonBag,
				status: (res.statusCode = err.status || 500),
				error: {
					message:
						err.code == 'ER_DUP_ENTRY'
							? 'Sorry, account already exist!'
							: err.message,
					data: { ...err },
				},
				data: null,
			});
		}
	},
);

module.exports = router;
