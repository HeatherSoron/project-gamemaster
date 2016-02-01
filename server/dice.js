// only supports well-formed <n>d<n> or d<n>expressions, right now
module.exports.roll = function(expr) {
	var parts = expr.split('d');
	var count = parts[0];
	var sides = parts[1];

	if (!count && count !== "0") {
		count = "1";
	}

	count = count - 0;
	sides = sides - 0;

	var sum = 0;

	for (var i = 0; i < count; ++i) {
		sum += Math.ceil(Math.random() * sides);
	}
	return sum;
}
