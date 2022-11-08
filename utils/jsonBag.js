module.exports = (req, res, next) => {
	const jsonBag = {
		status: res.statusCode,
		message: '',
		error: {
			message: '',
			data: {},
		},
		data: {},
	};

	global.jsonBag = { ...jsonBag };
	next();
};
