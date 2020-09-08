export interface IUserSignUp {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface IUserLogIn {
  email: string;
  password: string;
}

export interface IFacebookAuth {
  userID: string;
  token: string;
}

export interface IGoogleAuth {
  token: string;
}
