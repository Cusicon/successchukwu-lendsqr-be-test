const { Router } = require('express');
const crypto = require('crypto');
const jwtVerify = require('../../utils/jwtVerify');
const { authUserByPin } = require('../../utils/security');
const { body, validationResult } = require('express-validator');
const router = Router();

// --( DB )--
const knex = require('../../db/dbconnect');

// GET: find account name from account number
router.get(
	'/:account_no/account_name',
	jwtVerify,
	body('account_no', 'Account Number is important!').notEmpty().isNumeric(),
	async (req, res) => {
		const knexUser = knex('users');

		const { account_no } = req.params;

		try {
			const found_user = await mustBeValidAccountNo(knexUser, account_no);

			return res.json({
				...global.jsonBag,
				status: (res.statusCode = 200),
				message: 'Account Name found!',
				error: null,
				data: { account_name: found_user.fullname },
			});
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
	},
);

// POST: withdraw money
router.post(
	'/',
	jwtVerify,
	authUserByPin,
	body('amount', 'Amount is important!').notEmpty().isNumeric(),
	body('bank', 'Bank is important!').notEmpty().isString(),
	body('account_no', 'Account Number is important!').notEmpty().isNumeric(),
	body('account_name', 'Account Number is important!').notEmpty().isString(),
	body('description', 'Description is important!').notEmpty().isString(),
	body('auth_pin', 'Enter your PIN!').notEmpty().isString(),
	async (req, res) => {
		const knexUser = knex('users');
		const knexTransaction = knex('transactions');

		req.body = JSON.parse(JSON.stringify(req.body).toLowerCase());

		req.cleanBody([
			'amount',
			'bank',
			'account_no',
			'account_name',
			'description',
		]);

		const { account_no, amount, bank } = req.body;
		const modified_amount = `${amount}`;
		const session_id = crypto.randomBytes(16).toString('hex');
		const user_id = req.user.id;

		const errors = validationResult(req);

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
			await mustBeValidAccountNo(knexUser, account_no);

			req.body = {
				...req.body,
				amount: modified_amount,
				session_id,
				user_id,
			};
			await knexTransaction.insert({ ...req.body });

			return res.json({
				...global.jsonBag,
				status: (res.statusCode = 201),
				message: `Transfer successful! We have notified ${bank.toUpperCase()}, about your transfer...`,
				error: null,
				data: null,
			});
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
	},
);

module.exports = router;

async function mustBeValidAccountNo(knexUser, account_no) {
	const found_user_data = await knexUser.where('account_no', account_no);
	const found_user = found_user_data[0];

	if (!found_user) throw Error('No Account found!');

	return found_user;
}
