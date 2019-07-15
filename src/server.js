import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import cors from 'cors';

import mapTokenToUser from './common/mapTokenToUser';
import models from './models';
import schema from './schema';

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => ({
    models,
    user: await mapTokenToUser(req.headers['x-token'])
  })
});

const app = express();

app.use(cors());

apolloServer.applyMiddleware({ app, path: '/' });

const server = createServer(app);

const force = false;

models.sequelize.sync({ force }).then(() => {
  server.listen(8040, () => {
    // eslint-disable-next-line
    console.log(`Server is ready`);

    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async connectionParams => {
          const user = await mapTokenToUser(connectionParams.accessToken);

          return {
            models,
            user
          };
        }
      },
      {
        server,
        path: '/subscriptions'
      }
    );
  });
});
