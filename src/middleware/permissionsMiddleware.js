import { rule, shield } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server-express';

const isAuthenticated = rule()((parent, args, context) => {
  return context.user !== null;
});

const permissions = shield(
  {
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
    }
  },
  { fallbackError: new AuthenticationError('not authorised') }
);

export default permissions;
