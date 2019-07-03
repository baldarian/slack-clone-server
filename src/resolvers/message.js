import { withFilter } from 'graphql-subscriptions';
import pubsub, { MESSAGE_ADDED } from './../common/pubsub';

export default {
  Query: {
    messages: (parent, args, { models }) => {
      return models.Message.findAll({ where: args });
    }
  },
  Mutation: {
    createMessage: async (parent, args, { models, user }) => {
      const message = await models.Message.create({
        ...args,
        userId: user.id
      });

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message.dataValues });

      return message;
    }
  },
  Message: {
    user: (parent, args, { models }) => {
      return models.User.findOne({ where: { id: parent.userId } });
    },
    channel: (parent, args, { models }) => {
      return models.Channel.findOne({ where: { id: parent.channelId } });
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        (payload, args) => {
          return payload.messageAdded.channelId === Number(args.channelId);
        }
      )
    }
  }
};
