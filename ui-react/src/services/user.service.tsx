import axios from 'axios';
import { ModifyUserProps } from '../components/users.component';
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_URL}/users/`;

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'public');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  deleteUser(id:number) {
    return axios.put(API_URL + 'deleteUser',{}, { 
      params: {
        userId: id
      },
      headers: authHeader() 
    });
  }
  blockUser(id:number) {
    return axios.post(API_URL + 'blockUser',{}, { 
      params: {
        userId: id
      },
      headers: authHeader() 
    });
  }

  addUser(values: ModifyUserProps) {
    return axios.post(API_URL+'addUser',values,{
      params: {
        userId: values.id
      },
      headers: authHeader()
    })
  }

  modifyUser(values: ModifyUserProps,id: number) {
    return axios.post(API_URL+'updateUser',values,{
      params: {
        userId: id
      },
      headers: authHeader()
    })
  }
  
  getUsers() {
    return axios.get(API_URL + 'getAll', { headers: authHeader() });
  }
}

export default new UserService();
