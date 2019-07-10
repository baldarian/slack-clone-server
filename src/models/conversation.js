export default function(sequelize) {
  const Conversation = sequelize.define('conversation', {});

  Conversation.associate = ({ Channel, User }) => {
    Conversation.belongsTo(User, {
      foreignKey: 'first_user_id'
    });

    Conversation.belongsTo(User, {
      foreignKey: 'second_user_id'
    });

    Conversation.belongsTo(Channel, {
      foreignKey: 'channel_id'
    });
  };

  return Conversation;
}
