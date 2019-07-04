export default {
  Mutation: {
    createChannel: async (parent, args, { models, user }) => {
      const team = await models.Team.findOne({ where: { id: args.teamId } });
      const member = await models.Member.findOne({
        where: { userId: user.id, teamId: team.id }
      });

      if (!member.isAdmin) {
        throw new Error('you are not allowed to create channels for this team');
      }

      return models.Channel.create(args);
    }
  }
};
