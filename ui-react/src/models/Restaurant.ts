import { Meal } from "./Meal";

export interface Restaurant {
  name?: string,
  description?: string,
  id?: number,
  meals?: Array<Meal>
}