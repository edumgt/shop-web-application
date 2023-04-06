import axios from "axios";
import authHeader from './auth-header';
import AuthService from './auth.service';
const API_URL = `${process.env.REACT_APP_API_URL}/orders/`;

class OrderService {
  getOrders(userId:number) {
    if(AuthService.getCurrentUser().roles[0] === "ROLE_OWNER")
    {return axios
      .get(API_URL+ 'getAllForOwner',{
        params:{
          userId: userId
        },
        headers: authHeader() 
      })}
      else if(AuthService.getCurrentUser().roles[0] === "ROLE_USER") {
        return axios
      .get(API_URL+ 'getAllForUser',{
        params:{
          userId: userId
        },
        headers: authHeader() 
      })
      }
      else if(AuthService.getCurrentUser().roles[0] === "ROLE_ADMIN") {
        return axios
      .get(API_URL+ 'getAll',{
        headers: authHeader() 
      })
      }
      else return Promise.resolve()
  }

  addOrder(order: any) {
    const restaurantId = order.restaurantId
    const userId = order.userId
    const meals = order.meals
    return axios
      .post(API_URL+'addOrder',{userId,restaurantId,meals},{
        headers: authHeader()
      })
  }

  modifyOrder(payload: {orderId: number,status: string}) {
    const orderId = payload.orderId
    const status = payload.status
    return axios
      .post(API_URL+'updateOrderStatus',{orderId,status},{
        headers: authHeader()
      })
  }

  // deleteOrder(id:number) {
  //   return axios
  //     .put(API_URL+'deleteOrder',{},{
  //       params: {
  //         orderId: id
  //       },
  //       headers: authHeader()
  //     })
  // }
}

export default new OrderService();
