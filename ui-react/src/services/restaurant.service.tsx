import axios from "axios";
import { Restaurant } from "../models/Restaurant";
import authHeader from './auth-header';
import AuthService from './auth.service';
const API_URL = `${process.env.REACT_APP_API_URL}/restaurants/`;

class RestaurantService {
  getRestaurants() {
    if(AuthService.getCurrentUser().roles[0] === "ROLE_USER" || AuthService.getCurrentUser().roles[0] === "ROLE_ADMIN")
    {return axios
      .get(API_URL+ 'getAll',{
        headers: authHeader() 
      })}
    else return  axios
    .get(API_URL+ 'getAllForOwner',{
      params: {
        userId: AuthService.getCurrentUserId()
      },
      headers: authHeader() 
    })
  }

  addRestaurant(restaurant: Restaurant,mealsIds:Array<Number>) {
    const name = restaurant.name
    const description = restaurant.description
    return axios
      .post(API_URL+'addRestaurant',{name,description,mealsIds},{
        params:{
          userId: AuthService.getCurrentUserId()
        },
        headers: authHeader()
      })
  }

  modifyRestaurant(restaurant: Restaurant,mealsIds:Array<Number>) {
    const name = restaurant.name
    const description = restaurant.description
    return axios
      .post(API_URL+'updateRestaurant',{name,description,mealsIds},{
        params: {
          restaurantId: restaurant.id
        },
        headers: authHeader()
      })
  }

  deleteRestaurant(id:number) {
    return axios
      .put(API_URL+'deleteRestaurant',{},{
        params: {
          restaurantId: id
        },
        headers: authHeader()
      })
  }
}

export default new RestaurantService();
