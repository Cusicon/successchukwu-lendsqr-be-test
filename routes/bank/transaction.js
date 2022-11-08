const { Router } = require('express');
const jwtVerify = require('../../utils/jwtVerify');
const router = Router();

// --( DB )--
const knex = require('../../db/dbconnect');

// GET: view all user's transactions
router.get('/', jwtVerify, async (req, res) => {
	const knexTransaction = knex('transactions');

	try {
		const transactions = await knexTransaction.where('user_id', req.user.id);

		if (!transactions) throw Error('No transactions found!');

		return res.json({
			message: `All your transactions! (${transactions.length})`,
			error: null,
			data: { transactions },
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
