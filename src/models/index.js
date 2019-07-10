import Sequelize from 'sequelize';

const sequelize = new Sequelize('slack', 'postgres', 'qwerty', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import('./user'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
  Conversation: sequelize.import('./conversation')
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
