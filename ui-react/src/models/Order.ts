import { Meal } from "./Meal";
import { Restaurant } from "./Restaurant";

export interface Order {
  id?: number
  date: Date
  totalAmount: number
  restaurants: Array<Restaurant>
  orderStatuses: Array<{
    status: {
      name: string
    }
    date: Date
  }>
  orderMeals: Array<{
    meal: Meal
    quantity: number
  }>
}