export default function(sequelize, DataTypes) {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING
    }
  });

  Message.associate = ({ User, Conversation }) => {
    Message.belongsTo(User, {
      foreignKey: {
        field: 'sender_id',
        name: 'senderId'
      }
    });

    Message.belongsTo(Conversation);
  };

  return Message;
}
