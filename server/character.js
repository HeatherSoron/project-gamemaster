var dice = require('./dice.js');

function Character() {
}

Character.prototype.attack = function(target) {
	var result = {
		summary: this.name + " attacked " + target.name
	};
	result.attackRoll = dice.roll('1d20') + this.attackBonus;
	
	if (result.attackRoll >= target.ac) {
		result.damage = dice.roll(this.damageDice);
		target.hp -= result.damage;
		
		result.killed = (target.hp < 0);
	}

	return result;
}

module.exports.Character = Character;
