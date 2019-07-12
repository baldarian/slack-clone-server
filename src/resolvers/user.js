import { AuthenticationError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import auth from '../common/auth';

export default {
  Query: {
    me: (parent, args, { models, user }) => {
      return models.User.findOne({ where: { id: user.id } });
    },
    getUser: (parent, { id }, { models }) => {
      return models.User.findOne({ where: { id } });
    }
  },
  Mutation: {
    login: async (parent, { email, password }, { models }) => {
      const user = await models.User.findOne({ where: { email }, raw: true });

      if (!user) {
        throw new AuthenticationError('user not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AuthenticationError('user not found');
      }

      return {
        accessToken: auth.generateAccessToken(user),
        refreshToken: auth.generateRefreshToken(user)
      };
    },
    register: async (parent, args, { models }) => {
      await models.User.create(args);

      return true;
    }
  },
  User: {
    conversation: async (parent, args, { models, user }) => {
      const { Op } = models.Sequelize;

      return models.Conversation.findOne({
        where: {
          firstUserId: { [Op.or]: [user.id, parent.id] },
          secondUserId: { [Op.or]: [user.id, parent.id] }
        }
      });
    }
  }
};
