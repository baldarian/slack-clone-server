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
        senderId: user.id
      });

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message.dataValues });

      return message;
    }
  },
  Message: {
    conversation: (parent, args, { models }) => {
      return models.Conversation.findOne({
        where: { id: parent.conversationId }
      });
    },
    sender: (parent, args, { models }) => {
      return models.User.findOne({
        where: { id: parent.senderId }
      });
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED),
        (payload, args) => {
          return (
            payload.messageAdded.conversationId === Number(args.conversationId)
          );
        }
      )
    }
  }
};
