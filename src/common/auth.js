import Auth from 'node-jwt-auth';
import models from '../models';

const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

const mapPayloadToUser = async payload => {
  // retrieve id from payload
  const { id } = payload.user;
  // fetch the user by using above id
  const user = await models.User.findOne({ where: { id } });
  // if user is not found throw an error
  if (!user) {
    throw new Error();
  }
  // if everything was successful then return the user
  return user;
};

const auth = new Auth({
  accessSecret: ACCESS_SECRET,
  refreshSecret: REFRESH_SECRET,
  mapUserToPayload: user => ({ id: user.id }),
  mapUserToHashed: user => user.password,
  mapPayloadToUser,
  accessSingingOptions: { expiresIn: '1w' }
});

export default auth;
