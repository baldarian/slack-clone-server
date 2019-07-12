import bcrypt from 'bcryptjs';
import models from './';

export default function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          message: 'The username can only contain letters and numbers'
        },
        len: {
          args: [3, 25],
          message: 'The username needs to be 3 and 25 characters long'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          message: 'The password needs to be 3 and 25 characters long'
        }
      }
    }
  });

  User.afterValidate(async user => {
    user.password = await bcrypt.hash(user.password, 12);
  });

  User.associate = ({ Team, Channel, Member }) => {
    User.belongsToMany(Team, {
      through: Member
    });

    User.belongsToMany(Channel, {
      through: 'channel_member'
    });
  };

  return User;
}
