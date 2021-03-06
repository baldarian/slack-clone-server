import models from './';

export default function(sequelize, DataTypes) {
  const Channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING
    }
  });

  Channel.afterCreate(async channel => {
    await models.Conversation.create({ channelId: channel.id });
  });

  Channel.associate = ({ Team }) => {
    Channel.belongsTo(Team);
  };

  return Channel;
}
