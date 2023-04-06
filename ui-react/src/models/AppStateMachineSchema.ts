import { ModifyUserProps } from "../components/users.component";
import { Meal } from "./Meal";
import { Order } from "./Order";
import { Restaurant } from "./Restaurant";
import { User } from "./User";
import { UserInfo } from "./UserInfo";

export interface AppStateMachineContext {
  currentUser?: User
  meals?: [Meal]
  restaurants?: [Restaurant]
  users?: [UserInfo]
  orders?: [Order]
}

export interface AppStateMachineSchema {
  context: AppStateMachineContext
  states: {
    check_user_is_authenticated:{} //checks user is auth 
    home: {}
    login_page: {} // login page
    signed_in: {}
    login_initiated: {}
    sign_up: {} // sign up page
    facebook_auth: {}
    register_user: {}
    orders: {}
    orders_fetching: {}
    orders_add_order: {}
    orders_modify_order: {}
    restaurants: {}
    restaurants_fetching: {}
    restaurants_add_restaurant: {}
    restaurants_modify_restaurant: {}
    restaurants_delete_restaurant: {}
    meals: {}
    meals_fetching: {}
    meals_add_meal: {}
    meals_modify_meal:{}
    meals_delete_meal:{}
    users: {}
    users_fetching: {}
    users_delete_user:{}
    users_modify_user:{}
    users_add_user:{}
    users_block:{}
  },
  EventObject: {}
}
export type AddRestaurantEvent = {
  type: 'ADD_RESTAURANT',
  payload: {
    restaurant: Restaurant
    mealsIds: Array<Number>
  }
}
export type ModifyRestaurantEvent = {
  type: 'MODIFY_RESTAURANT',
  payload: {
    restaurant: Restaurant
    mealsIds: Array<Number>
  }
}
export type DeleteRestaurantEvent = {
  type: 'DELETE_RESTAURANT',
  payload: {
    restaurantId: number
  }
}
export type AddUserEvent = {
  type: 'ADD_USER',
  payload: ModifyUserProps
}
export type ModifyUserEvent = {
  type: 'MODIFY_USER';
  payload: ModifyUserProps
}
export type DeleteUserEvent = {
  type: 'DELETE_USER';
  payload: {
    id: number
  }
}
export type BlockUserEvent = {
  type: 'BLOCK_USER';
  payload: {
    id: number
  }
}
export type RegisterEvent = {
  type: 'REGISTER';
  payload: {
    username: string,
    email:string,
    password: string
  }
}
export type AddMealEvent = {
  type: 'ADD_MEAL';
  payload: {
    meal: Meal
  }
}
export type DeleteMealEvent = {
  type: 'DELETE_MEAL';
  payload: {
    id: number
  }
}
export type ModifyMealEvent = {
  type: 'MODIFY_MEAL';
  payload: {
    meal: Meal
  }
}
export type LoginEvent = {
  type: 'LOGIN';
  payload: {
    userName: string
    password: string
  }
}
export type FacebookAuthEvent = {
  type: 'FACEBOOK_AUTH';
  payload: {
    username: string,
    email: string,
    photoUrl: string,
    accessToken: string
  }
}
export type AddOrderEvent = {
  type: 'ADD_ORDER',
  payload: {
    userId?: number,
    restaurantId?: number,
    meals: Array<any>
  }
}
export type ModifyOrderEvent = {
  type: 'MODIFY_ORDER';
  payload: {
    orderId: number,
    status: string
  }
}
export type AppStateMachineEvent = AddMealEvent | LoginEvent 
  | RegisterEvent | DeleteUserEvent | ModifyUserEvent | AddUserEvent | ModifyMealEvent | DeleteMealEvent 
  | AddRestaurantEvent | ModifyRestaurantEvent | DeleteRestaurantEvent | FacebookAuthEvent | BlockUserEvent
  | AddOrderEvent | ModifyOrderEvent
  | {type: 'SIGNED_IN'}
  | {type: 'HOME'}
  | {type: 'LOGIN_PAGE'}
  | {type: 'LOG_OUT'}
  | {type: 'MEALS'}
  | {type: 'SIGN_UP'}
  | {type: 'USERS'}
  | {type: 'ADMIN_PANEL'}
  | {type: 'RESTAURANTS'}
  | {type: 'ORDERS'}
  