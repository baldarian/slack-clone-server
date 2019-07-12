import models from './';

export default function(sequelize, DataTypes) {
  const Member = sequelize.define('member', {
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Member.afterCreate(async ({ userId }) => {
    const members = await models.User.findAll({
      where: { id: userId },
      include: [models.Team]
    });

    return models.Conversation.bulkCreate(
      members.map(member => ({
        firstUserId: userId,
        secondUserId: member.id
      }))
    );
  });

  return Member;
}
