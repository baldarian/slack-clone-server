export default function(sequelize, DataTypes) {
  const Member = sequelize.define('member', {
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Member;
}
