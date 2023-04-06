import axios from "axios";
import { Meal } from "../models/Meal";
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_URL}/meals/`;

class MealsService {
  getMeals() {
    return axios
      .get(API_URL+ 'getAll',{
        headers: authHeader() 
      })
  }

  addMeal(meal: Meal) {
    const name = meal.name
    const description = meal.description
    const price = meal.price
    return axios
      .post(API_URL+'addMeal',{name,description,price},{
        headers: authHeader()
      })
  }

  modifyMeal(meal: Meal) {
    const name = meal.name
    const description = meal.description
    const price = meal.price
    return axios
      .post(API_URL+'updateMeal',{name,description,price},{

        params: {
          mealId: meal.id
        },
        headers: authHeader()
      })
  }

  deleteMeal(id:number) {
    return axios
      .put(API_URL+'deleteMeal',{},{
        params: {
          mealId: id
        },
        headers: authHeader()
      })
  }
}

export default new MealsService();
