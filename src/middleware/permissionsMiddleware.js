import { rule, shield, and } from 'graphql-shield';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const isAuthenticated = rule()(async (parent, args, context) => {
  if (!context.user) {
    throw new AuthenticationError('Not authorised');
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
    messageAdded: and(isAuthenticated)
  }
});

export default permissions;
