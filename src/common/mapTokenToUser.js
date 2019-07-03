import auth from './auth';

async function mapTokenToUser(token) {
  try {
    const payload = await auth.verifyAccessToken(token);

    return payload;
  } catch (e) {
    return null;
  }
}

export default mapTokenToUser;
