export default {
  Query: {
    directMessages: (parent, { teamId, userId }, { models, user }) => {
      const { Op } = models.sequelize;

      return models.DirectMessage.findAll({
        where: {
          teamId,
          [Op.or]: [
            {
              from: user.id,
              to: userId
            },
            {
              from: userId,
              to: user.id
            }
          ]
        }
      });
    }
  },
  Mutation: {
    createDirectMessage: async (
      parent,
      { receiverId, teamId },
      { models, user }
    ) => {
      const message = await models.DirectMessage.create({
        teamId,
        from: user.id,
        to: receiverId
      });

      return message;
    }
  },
  DirectMessage: {
    sender: (parent, args, { models }) => {
      return models.User.findOne({ where: { id: parent.from } });
    },
    receiver: (parent, args, { models }) => {
      return models.User.findOne({ where: { id: parent.to } });
    }
  }
};
