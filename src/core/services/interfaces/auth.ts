export interface IUserSignUp {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  image_url: string;
}

export interface IUserLogIn {
  email: string;
  password: string;
}
