import OAuthAPI from './oauth';
import PublicAPI from './public';
import PrivateAPI from './private';

export default {
  oAuth: OAuthAPI,
  public: PublicAPI,
  private: new PrivateAPI(),
};
