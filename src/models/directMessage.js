export default function(sequelize, DataTypes) {
  const DirectMessage = sequelize.define('direct_message', {
    text: {
      type: DataTypes.STRING
    }
  });

  DirectMessage.associate = ({ User, Team }) => {
    DirectMessage.belongsTo(Team);
    DirectMessage.belongsTo(User, { foreignKey: 'from' });
    DirectMessage.belongsTo(User, { foreignKey: 'to' });
  };

  return DirectMessage;
}
