export default function(sequelize, DataTypes) {
  const Channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Channel.associate = ({ Team, User }) => {
    Channel.belongsTo(Team);

    Channel.belongsToMany(User, {
      through: 'channel_member'
    });
  };

  return Channel;
}
