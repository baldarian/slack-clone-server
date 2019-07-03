export default {
  Mutation: {
    createChannel: async (parent, args, { models, user }) => {
      const team = await models.Team.findOne({ where: { id: args.teamId } });

      if (team.owner !== user.id) {
        throw new Error('you are not allowed to create channels for this team');
      }

      return models.Channel.create(args);
    }
  }
};
