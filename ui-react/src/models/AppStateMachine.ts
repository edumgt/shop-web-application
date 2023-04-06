import { message } from "antd"
import { Machine, assign } from "xstate"
import UserService from "../services/user.service"
import AuthService from "../services/auth.service"
import MealService from "../services/meal.service"
import OrderService from "../services/order.service"
import RestaurantService from "../services/restaurant.service"
import { AppStateMachineContext, AppStateMachineSchema, AppStateMachineEvent, LoginEvent, AddMealEvent, ModifyMealEvent, DeleteMealEvent, RegisterEvent, DeleteUserEvent, ModifyUserEvent, AddUserEvent, AddRestaurantEvent, ModifyRestaurantEvent, DeleteRestaurantEvent, FacebookAuthEvent, BlockUserEvent, AddOrderEvent, ModifyOrderEvent } from "./AppStateMachineSchema"
import { User } from "./User"

export const createAppStateMachine = (currentUser?: User) =>
  Machine<AppStateMachineContext, AppStateMachineSchema, AppStateMachineEvent>({
    initial: currentUser ? 'home' : 'login_page',
    id: 'app-state-machine',
    context: {
      currentUser: currentUser
    },
    states: {
      check_user_is_authenticated: {
        invoke: {
          id: 'check-user-is-authenticated',
          src: 'authenticateUser',
          onDone: 'signed_in',
          onError: {
            target: 'login_page',
            actions: assign({
              currentUser: (context) => {
                localStorage.removeItem("user")
                return undefined
              }
            })
          }
        }
      },
      home: {
        on: {
          LOGIN_PAGE: 'login_page',
          SIGN_UP: 'sign_up',
          LOG_OUT: {
            target: 'home',
            actions: 'logOut'
          },
          USERS: 'users_fetching',
          MEALS: 'meals_fetching',
          RESTAURANTS: 'restaurants_fetching',
          ORDERS: 'orders_fetching'
        }
      },
      signed_in: {
        on: {
          LOG_OUT: {
            target: 'home',
            actions: 'logOut'
          },
          USERS: 'users_fetching',
          LOGIN_PAGE: 'login_page',
          SIGN_UP: 'sign_up',
          MEALS: 'meals_fetching',
          HOME: 'home',
          ORDERS: 'orders_fetching',
          RESTAURANTS: 'restaurants_fetching'
        }
      },
      login_page: {
        on: {
          LOGIN: 'login_initiated',
          SIGN_UP: 'sign_up',
          HOME: 'home',
          MEALS: 'meals_fetching',
          FACEBOOK_AUTH: 'facebook_auth',
          RESTAURANTS: 'restaurants_fetching'
        }
      },
      login_initiated: {
        invoke: {
          id: 'loginInvoke',
          src: 'loginService',
          onDone: {
            target: 'signed_in',
            actions: [
              (context, event) => {
                localStorage.setItem('user', JSON.stringify(event.data.data))
                message.success("You have logged in succesfully.", 2)
              },
              assign({
                currentUser: (context, event) => event.data.data
              })
            ]
          },
          onError: {
            target: 'login_page',
            actions: (context, event) =>  message.error(event.data.response.data.message, 2)
          }
        },
        on: {
          SIGNED_IN: {
            target: 'signed_in',
            actions: assign({
              currentUser: (context) => AuthService.getCurrentUser()
            })
          }
        }
      },
      sign_up: {
        on: {
          REGISTER: 'register_user',
          FACEBOOK_AUTH: 'facebook_auth',
          LOGIN_PAGE: 'login_page',
          HOME: 'home'
        }
      },
      facebook_auth: {
        invoke: {
          id: 'facebook-auth',
          src: 'facebookAuth',
          onDone: {
            target: 'signed_in',
            actions: assign({
              currentUser: (context, event) => {
                message.success('User authenticated with success', 2)
                localStorage.setItem('user', JSON.stringify(event.data.data))
                return event.data.data
              }
            })
          },
          onError: {
            target: 'sign_up',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      register_user: {
        invoke: {
          id: 'register-user',
          src: 'registerUser',
          onDone: {
            target: 'signed_in',
            actions: assign({
              currentUser: (context, event) => {
                if(event.data.data === "Confirmation email was sent!")
                {
                  message.success('Confirmation email was sent!', 2)
                  return undefined;
                }
                localStorage.setItem('user', JSON.stringify(event.data.data))
                return event.data.data
              }
            })
          },
          onError: {
            target: 'sign_up',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      meals_fetching: {
        invoke: {
          id: 'fetch-meals',
          src: 'fetchMeals',
          onDone: {
            target: 'meals',
            actions: assign({
              meals: (context, event) => event.data.data
            })
          },
          onError: {
            target: 'home',
            actions: () => message.error('There was an error fetching the meals', 2)
          }
        }
      },
      meals: {
        on: {
          ADD_MEAL: 'meals_add_meal',
          LOG_OUT: {
            target: 'home',
            actions: 'logOut'
          },
          HOME: 'home',
          USERS: 'users_fetching',
          RESTAURANTS: 'restaurants_fetching',
          ORDERS: 'orders_fetching',
          MEALS: 'meals_fetching',
          MODIFY_MEAL: 'meals_modify_meal',
          DELETE_MEAL: 'meals_delete_meal'
        }
      },
      meals_add_meal: {
        invoke: {
          id: 'meals_add_meal',
          src: 'addMeal',
          onDone: {
            target: 'meals_fetching',
            actions: () => message.success('Meal added succesfully', 2)
          },
          onError: {
            target: 'meals',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      meals_modify_meal: {
        invoke: {
          id: 'meals_modify_meal',
          src: 'modifyMeal',
          onDone: {
            target: 'meals_fetching',
            actions: () => message.success('Meal modified succesfully', 2)
          },
          onError: {
            target: 'meals',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      meals_delete_meal: {
        invoke: {
          id: 'meals_delete_meal',
          src: 'deleteMeal',
          onDone: {
            target: 'meals_fetching',
            actions: () => message.success('Meal deleted succesfully', 2)
          },
          onError: {
            target: 'meals',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      users_fetching: {
        invoke: {
          id: 'fetch_users',
          src: 'fetchUsers',
          onDone: {
            target: 'users',
            actions: assign({
              users: (context, event) => {
                return event.data.data
              }
            })
          },
          onError: {
            target: 'home',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      users: {
        on: {
          HOME: 'home',
          LOG_OUT: {
            target: 'home',
            actions: 'logOut'
          },
          DELETE_USER: 'users_delete_user',
          MODIFY_USER: 'users_modify_user',
          ADD_USER: 'users_add_user',
          MEALS: 'meals_fetching',
          USERS: 'users_fetching',
          RESTAURANTS: 'restaurants_fetching',
          ORDERS: 'orders_fetching',
          BLOCK_USER: 'users_block'
        }
      },
      users_block: {
        invoke: {
          id: 'block-user',
          src: 'blockUser',
          onDone: {
            target: 'users_fetching',
            actions: (context,event) => {
              message.success(event.data.data, 2)
            }
          },
          onError: {
            target: 'users',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      users_delete_user: {
        invoke: {
          id: 'delete-user',
          src: 'deleteUser',
          onDone: {
            target: 'users_fetching',
            actions: () => message.success("The user was deleted successfully.", 2)
          },
          onError: {
            target: 'users',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      users_modify_user: {
        invoke: {
          id: 'modify-user',
          src: 'modifyUser',
          onDone: {
            target: 'users_fetching',
            actions: () => message.success("The user has been modified successfully", 2)
          },
          onError: {
            target: 'users',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      users_add_user: {
        invoke: {
          id: 'add-user',
          src: 'addUser',
          onDone: {
            target: 'users_fetching',
            actions: () => message.success("The user has been added successfully", 2)
          },
          onError: {
            target: 'users',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      restaurants: {
        on: {
          ADD_RESTAURANT: 'restaurants_add_restaurant',
          LOG_OUT: {
            target: 'home',
            actions: 'logOut'
          },
          HOME: 'home',
          USERS: 'users_fetching',
          RESTAURANTS: 'restaurants_fetching',
          ORDERS: 'orders_fetching',
          MEALS: 'meals_fetching',
          ADD_ORDER: 'orders_add_order',
          MODIFY_RESTAURANT: 'restaurants_modify_restaurant',
          DELETE_RESTAURANT: 'restaurants_delete_restaurant'
        }
      },
      restaurants_fetching: {
        invoke: {
          id: 'fetch-restaurants',
          src: 'fetchRestaurants',
          onDone: {
            target: 'restaurants',
            actions: assign({
              restaurants: (context, event) => event.data[0].data,
              meals: (context, event) => event.data[1].data
            })
          },
          onError: {
            target: 'home',
            actions: () => message.error('There was an error fetching the restaurants', 2)
          }
        }
      },
      restaurants_add_restaurant: {
        invoke: {
          id: 'restaurants_add_restaurant',
          src: 'addRestaurant',
          onDone: {
            target: 'restaurants_fetching',
            actions: () => message.success('Restaurant added succesfully', 2)
          },
          onError: {
            target: 'restaurants',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      restaurants_modify_restaurant: {
        invoke: {
          id: 'restaurants_modify_restaurant',
          src: 'modifyRestaurant',
          onDone: {
            target: 'restaurants_fetching',
            actions: () => message.success('Restaurant modified succesfully', 2)
          },
          onError: {
            target: 'restaurants',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      restaurants_delete_restaurant: {
        invoke: {
          id: 'restaurants_delete_restaurant',
          src: 'deleteRestaurant',
          onDone: {
            target: 'restaurants_fetching',
            actions: () => message.success('Restaurant deleted succesfully', 2)
          },
          onError: {
            target: 'restaurants',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      orders: {
        on: {
          LOG_OUT: {
            target: 'home',
            actions: 'logOut'
          },
          HOME: 'home',
          USERS: 'users_fetching',
          ORDERS: 'orders_fetching',
          RESTAURANTS: 'restaurants_fetching',
          MEALS: 'meals_fetching',
          MODIFY_ORDER: 'orders_modify_order'
        }
      },
      orders_fetching: {
        invoke: {
          id: 'fetch-orders',
          src: 'fetchOrders',
          onDone: {
            target: 'orders',
            actions: assign({
              orders: (context, event) => event.data?.data
            })
          },
          onError: {
            target: 'home',
            actions: () => message.error('There was an error fetching the orders', 2)
          }
        }
      },
      orders_add_order: {
        invoke: {
          id: 'orders_add_order',
          src: 'addOrder',
          onDone: {
            target: 'orders_fetching',
            actions: () => {
              message.success('Order added succesfully', 2)
            }
          },
          onError: {
            target: 'restaurants',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      },
      orders_modify_order: {
        invoke: {
          id: 'orders-modify-order',
          src: 'modifyOrder',
          onDone: {
            target: 'orders_fetching',
            actions: () => message.success('Order modified succesfully', 2)
          },
          onError: {
            target: 'orders',
            actions: (context, event) => message.error(event.data.response.data.message, 2)
          }
        }
      }
    }
  }, {
    actions: {
      logOut: assign({
        currentUser: (context) => {
          AuthService.logout()
          message.success('You have logged out succesfully.', 2)
          return undefined
        }
      })
    },
    services: {
      authenticateUser: (context) => {
        return AuthService.checkIfUserIsLoggedIn(AuthService.getCurrentUser().username)
      },
      facebookAuth: (context,event) => {
        return AuthService.facebookAuth((event as FacebookAuthEvent).payload.username,(event as FacebookAuthEvent).payload.email,(event as FacebookAuthEvent).payload.photoUrl,(event as FacebookAuthEvent).payload.accessToken)
      },
      loginService: (context, event) => {

        return AuthService.login((event as LoginEvent).payload.userName, (event as LoginEvent).payload.password);
      },
      fetchMeals: (context, event) => {
        return MealService.getMeals();
      },
      addMeal: (context, event) => {
        return MealService.addMeal((event as AddMealEvent).payload.meal);
      },
      modifyMeal: (context, event) => {
        return MealService.modifyMeal((event as ModifyMealEvent).payload.meal);
      },
      deleteMeal: (contex, event) => {
        return MealService.deleteMeal((event as DeleteMealEvent).payload.id)
      },
      registerUser: (context, event) => {
        return AuthService.register((event as RegisterEvent).payload.username, (event as RegisterEvent).payload.email, (event as RegisterEvent).payload.password);
      },
      fetchUsers: (context, event) => {
        return UserService.getUsers();
      },
      deleteUser: (context, event) => {
        return UserService.deleteUser((event as DeleteUserEvent).payload.id);
      },
      blockUser:(context,event) => {
        return UserService.blockUser((event as BlockUserEvent).payload.id);
      },
      modifyUser: (context, event) => {
        return UserService.modifyUser((event as ModifyUserEvent).payload, AuthService.getCurrentUserId());
      },
      addUser: (context, event) => {
        return UserService.addUser((event as AddUserEvent).payload);
      },
      fetchRestaurants: (context, event) => {
        return Promise.all([RestaurantService.getRestaurants(), MealService.getMeals()]);
      },
      addRestaurant: (context, event) => {
        return RestaurantService.addRestaurant((event as AddRestaurantEvent).payload.restaurant, (event as AddRestaurantEvent).payload.mealsIds);
      },
      modifyRestaurant: (context, event) => {
        return RestaurantService.modifyRestaurant((event as ModifyRestaurantEvent).payload.restaurant, (event as ModifyRestaurantEvent).payload.mealsIds);
      },
      deleteRestaurant: (context, event) => {
        return RestaurantService.deleteRestaurant((event as DeleteRestaurantEvent).payload.restaurantId);
      },
      fetchOrders: (context,event) => {
        return OrderService.getOrders(AuthService.getCurrentUserId());
      },
      addOrder: (context,event) => {
        return OrderService.addOrder((event as AddOrderEvent).payload);
      },
      modifyOrder:(context,event) => {
        return OrderService.modifyOrder((event as ModifyOrderEvent).payload);
      }
    }
  })