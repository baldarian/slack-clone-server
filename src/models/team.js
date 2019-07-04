import models from './';

export default function(sequelize, DataTypes) {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING
    }
  });

  Team.afterCreate((team, options) => {
    return Promise.all([
      models.Channel.create({ teamId: team.id, name: 'general' }),
      models.Member.create({
        isAdmin: true,
        userId: options.userId,
        teamId: team.id
      })
    ]);
  });

  Team.associate = ({ User, Member }) => {
    Team.belongsToMany(User, {
      through: Member
    });
  };

  return Team;
}
