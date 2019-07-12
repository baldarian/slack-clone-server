export default function(sequelize) {
  const Conversation = sequelize.define('conversation', {});

  Conversation.associate = ({ Channel, User }) => {
    Conversation.belongsTo(User, {
      foreignKey: {
        field: 'first_user_id',
        name: 'firstUserId'
      }
    });

    Conversation.belongsTo(User, {
      foreignKey: {
        field: 'second_user_id',
        name: 'secondUserId'
      }
    });

    Conversation.belongsTo(Channel, {
      foreignKey: {
        field: 'channel_id',
        name: 'channelId'
      }
    });
  };

  return Conversation;
}
