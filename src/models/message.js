export default function(sequelize, DataTypes) {
  const Message = sequelize.define('message', {
    text: {
      type: DataTypes.STRING
    }
  });

  Message.associate = ({ Channel, User }) => {
    Message.belongsTo(Channel);

    Message.belongsTo(User);
  };

  return Message;
}
