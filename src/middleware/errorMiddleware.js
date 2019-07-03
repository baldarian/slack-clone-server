import { UserInputError } from 'apollo-server-express';

const errorMiddleware = async (resolve, root, args, context, info) => {
  let result;
  try {
    result = await resolve(root, args, context, info);
    return result;
  } catch (e) {
    if (e instanceof context.models.Sequelize.ValidationError) {
      const errors = e.errors.map(x => ({ path: x.path, message: x.message }));

      throw new UserInputError('Form Arguments invalid', {
        errors
      });
    }

    throw e;
  }
};

export default errorMiddleware;
