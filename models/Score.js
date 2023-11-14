const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Score extends Model {
		static associate(models) {
			Score.belongsTo(models.user);
		}
	}
	
	Score.init({
		score: {
			type: DataTypes.INTEGER
		}
	}, {
		sequelize,
		modelName: 'score',
	});

	return Score;
};