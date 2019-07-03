import 'dotenv/config';
import { makeExecutableSchema } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { applyMiddleware } from 'graphql-middleware';
import path from 'path';

import errorMiddleware from './middleware/errorMiddleware';
import permissionsMiddleware from './middleware/permissionsMiddleware';

const typeDefs = mergeTypes(
  // eslint-disable-next-line no-undef
  fileLoader(path.join(__dirname, './types'), {
    extensions: ['.graphql']
  })
);

const resolvers = mergeResolvers(
  // eslint-disable-next-line no-undef
  fileLoader(path.join(__dirname, './resolvers'))
);

const schema = makeExecutableSchema({ typeDefs, resolvers });

const schemaWithMiddleware = applyMiddleware(
  schema,
  errorMiddleware,
  permissionsMiddleware
);

export default schemaWithMiddleware;
