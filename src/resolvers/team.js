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
      return models.Team.create({ ...args, owner: user.id });
    },
    addTeamMember: async (
      parent,
      { email, teamId },
      { models, user: _user }
    ) => {
      const user = await models.User.findOne({ where: { id: _user.id } });
      const team = await models.Team.findOne({ where: { id: teamId } });

      if (team.owner !== user.id) {
        throw new Error('You are not allowed to add a member to this team');
      }

      const userToAdd = await models.User.findOne({ where: { email } });

      if (!userToAdd) {
        throw new Error('No user exists with such email');
      }

      if (userToAdd.email === user.email) {
        throw new Error("You can't invite yourself");
      }

      const member = await models.Member.findOne({
        where: { userId: userToAdd.id, teamId: team.id }
      });

      if (member) {
        throw new Error('User is already invited to this team');
      }

      await models.Member.create({ userId: userToAdd.id, teamId: team.id });

      return true;
    }
  },
  Team: {
    channels: (parent, args, { models }) => {
      return models.Channel.findAll({ where: { teamId: parent.id } });
    }
  }
};
