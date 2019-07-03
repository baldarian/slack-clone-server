import models from './';

export default function(sequelize, DataTypes) {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING
    }
  });

  Team.afterCreate(team => {
    return Promise.all([
      models.Channel.create({ teamId: team.id, name: 'general' }),
      models.Member.create({ userId: team.owner, teamId: team.id })
    ]);
  });

  Team.associate = ({ User, Member }) => {
    Team.belongsToMany(User, {
      through: Member
    });

    Team.belongsTo(User, {
      foreignKey: 'owner'
    });
  };

  return Team;
}
