import AuthService from './auth';

class Services {
  public Auth: AuthService;

  constructor() {
    this.Auth = new AuthService();
  }
}

export default Services;
