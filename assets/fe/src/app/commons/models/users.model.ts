export interface Login {
  email: string;
  password: string;
}

export interface Signup {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  type: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  photo: string;
}

export interface UserShort {

}
