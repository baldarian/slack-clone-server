export default function(sequelize, DataTypes) {
  const Member = sequelize.define('member', {
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Member.afterCreate(async member => {
    await models.Conversation.create({ channelId: member.id });
  });

  return Member;
}
