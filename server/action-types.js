function Move() {
}

function Standard() {
}

function FullAttack(taken, remaining, canCancel) {
	this.taken = taken;
	this.remaining = remaining;
	this.canCancel = canCancel;
}

module.exports.Move = Move;
module.exports.Standard = Standard;
module.exports.FullAttack = FullAttack;
