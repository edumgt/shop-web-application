import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/auth/`;

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
  }

  facebookAuth(username:string,email:string,photoUrl:string,accessToken: string) {
    return axios.post(API_URL+"facebook-signIn",{username,email,photoUrl,accessToken})
  }
  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }
  checkIfUserIsLoggedIn(username: string) {
    return axios.post(API_URL + 'authenticate',{username})
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : undefined;
  }

  getCurrentUserId() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : undefined;
  }
}

export default new AuthService();
