interface BaseUser {
  email: string;
}

export interface GoogleUser extends BaseUser {
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}
