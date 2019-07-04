export default {
  Query: {
    teams: async (parent, args, { models, user }) => {
      return models.sequelize.query(
        `
        SELECT * FROM teams
        INNER JOIN members
        ON members.user_id = :userId
        AND members.team_id = teams.id`,
        {
          replacements: { userId: user.id },
          model: models.Team
        }
      );
    }
  },
  Mutation: {
    createTeam: (parent, args, { models, user }) => {
      return models.Team.create({ ...args }, { userId: user.id });
    },
    addTeamMember: async (
      parent,
      { email, teamId },
      { models, user: _user }
    ) => {
      const user = await models.User.findOne({ where: { id: _user.id } });
      const member = await models.Member.findOne({
        where: { teamId, userId: user.id }
      });

      if (!member.isAdmin) {
        throw new Error('You are not allowed to add a member to this team');
      }

      const userToAdd = await models.User.findOne({ where: { email } });

      if (!userToAdd) {
        throw new Error('No user exists with such email');
      }

      if (userToAdd.email === user.email) {
        throw new Error("You can't invite yourself");
      }

      const memberToAdd = await models.Member.findOne({
        where: { userId: userToAdd.id, teamId }
      });

      if (memberToAdd) {
        throw new Error('User is already invited to this team');
      }

      await models.Member.create({ userId: userToAdd.id, teamId });

      return true;
    }
  },
  Team: {
    channels: (parent, args, { models }) => {
      return models.Channel.findAll({ where: { teamId: parent.id } });
    },
    isAdmin: async (parent, args, { models, user }) => {
      const { isAdmin } = await models.Member.findOne({
        where: { teamId: parent.id, userId: user.id }
      });

      return isAdmin;
    }
  }
};
