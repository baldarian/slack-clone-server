import { rule, shield, and } from 'graphql-shield';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const isAuthenticated = rule()(async (parent, args, context) => {
  if (!context.user) {
    throw new AuthenticationError('Not authorised');
  }

  return true;
});

const isTeamMember = rule()(async (parent, { channelId }, { models, user }) => {
  const channel = await models.Channel.findOne({ where: { id: channelId } });
  const member = await models.Member.findOne({
    where: { teamId: channel.teamId, userId: user.id }
  });

  if (!member) {
    throw new ForbiddenError('You are not a team member');
  }

  return true;
});

const permissions = shield({
  Query: {
    teams: isAuthenticated,
    me: isAuthenticated,
    messages: isAuthenticated
  },
  Mutation: {
    createTeam: isAuthenticated,
    addTeamMember: isAuthenticated,
    createChannel: isAuthenticated,
    createMessage: isAuthenticated
  },
  Subscription: {
    messageAdded: and(isAuthenticated, isTeamMember)
  }
});

export default permissions;
