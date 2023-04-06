import React, {useState} from "react";
import "./style/index.css";
import AuthService from "./services/auth.service";
import {useMachine} from '@xstate/react';
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Match from "./utils/Match";
import Users, {ModifyUserProps} from "./components/users.component";
import Meals from "./components/meals.component";
import {Meal} from "./models/Meal";
import {createAppStateMachine} from "./models/AppStateMachine";
import Restaurants from "./components/restaurants.component";
import {Restaurant} from "./models/Restaurant";
import Orders from "./components/orders.component";
import {Layout, Menu} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  TrademarkOutlined,
  HomeOutlined,
  SnippetsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const {Header, Sider, Content} = Layout;
export const App: React.FC = () => {

  const [current, send] = useMachine(createAppStateMachine(AuthService.getCurrentUser()))
  const [collapsed, setCollapsed] = useState(false)
  return (


    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo"/>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="home" icon={<HomeOutlined/>}
                     onClick={e => {
                       send({type: 'HOME'})
                     }}>
            Home
          </Menu.Item>
          {current.context.currentUser &&
              <Menu.Item key="restaurants" icon={<TrademarkOutlined/>}
                         onClick={e => {
                           send({type: 'RESTAURANTS'})
                         }}>
                  Restaurants
              </Menu.Item>
          }
          {current.context.currentUser &&
              <Menu.Item key="orders" icon={<SnippetsOutlined/>}
                         onClick={e => {
                           send({type: 'ORDERS'})
                         }}>
                  Orders
              </Menu.Item>}
          {current.context.currentUser &&
            current.context.currentUser.roles[0] !== "ROLE_USER" &&
              <Menu.Item key="meals" icon={<UploadOutlined/>}
                         onClick={e => {
                           send({type: 'MEALS'})
                         }}>
                  Meals
              </Menu.Item>}
          {current.context.currentUser &&
            current.context.currentUser.roles[0] === "ROLE_ADMIN" &&
              <Menu.Item key="users" icon={<UploadOutlined/>}
                         onClick={e => {
                           send({type: 'USERS'})
                         }}>
                  Users
              </Menu.Item>}
          {current.context.currentUser &&
              <Menu.Item key="username" icon={<UserOutlined/>}>
                {current.context.currentUser.username}
              </Menu.Item>}
          {current.context.currentUser ?
            <Menu.Item key="logout" icon={<LogoutOutlined/>}
                       onClick={e => {
                         send({type: 'LOG_OUT'})
                       }}>
              Log out
            </Menu.Item> : (
              <>
                <Menu.Item key="login" icon={<VideoCameraOutlined/>}
                           onClick={e => {
                             send({type: 'LOGIN_PAGE'})
                           }}>
                  Log in
                </Menu.Item>
                <Menu.Item key="signup" icon={<VideoCameraOutlined/>}
                           onClick={e => {
                             send({type: 'SIGN_UP'})
                           }}>
                  Sign up
                </Menu.Item>
              </>
            )}

        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{padding: 0}}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed)
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: window.innerHeight - 100,
          }}
        >
          <Match state={['home', 'signed_in']} current={current}>
            <Home/>
          </Match>

          <Match state={'login_page'} current={current}>
            <Login
              onLogin={(userName: string, password: string) => {
                send({
                  type: 'LOGIN',
                  payload: {
                    userName: userName,
                    password: password
                  }
                })
              }}
              onFacebookAuth={(username: string, email: string, photoUrl: string, accessToken: string) =>
                send({
                  type: 'FACEBOOK_AUTH',
                  payload: {
                    username: username,
                    email: email,
                    photoUrl: photoUrl,
                    accessToken: accessToken
                  }
                })}
            />
          </Match>

          <Match state={"sign_up"} current={current}>
            <Register
              onRegister={(username: string, email: string, password: string) =>
                send({
                  type: 'REGISTER',
                  payload: {
                    username: username,
                    email: email,
                    password: password
                  }
                })}
              onFacebookAuth={(username: string, email: string, photoUrl: string, accessToken: string) =>
                send({
                  type: 'FACEBOOK_AUTH',
                  payload: {
                    username: username,
                    email: email,
                    photoUrl: photoUrl,
                    accessToken: accessToken
                  }
                })}
            />
          </Match>

          <Match state={"meals"} current={current}>
            <Meals meals={current.context.meals}
                   canAdd={current.context.currentUser &&
                     current.context.currentUser.roles[0] !== "ROLE_USER"}
                   deleteMeal={(id: number) => {
                     send({type: 'DELETE_MEAL', payload: {id: id}})
                   }}
                   modifyMeal={(meal: Meal) => {
                     send({type: 'MODIFY_MEAL', payload: {meal: meal}})
                   }}
                   addMeal={(meal: Meal) => {
                     send({type: 'ADD_MEAL', payload: {meal: meal}})
                   }
                   }

                   isInOrder={false}>
            </Meals>
          </Match>

          <Match state={"restaurants"} current={current}>
            <Restaurants
              restaurants={current.context.restaurants}
              meals={current.context.meals}
              isRegularUser={current.context.currentUser?.roles[0] === "ROLE_USER"}
              addOrder={(meals: Array<any>, restaurantId?: number) => {
                console.log(meals, restaurantId)
                send({
                  type: 'ADD_ORDER', payload: {
                    userId: current.context.currentUser?.id,
                    restaurantId: restaurantId,
                    meals: meals
                  }
                })
              }}
              deleteRestaurant={(id: number) => {
                send({type: 'DELETE_RESTAURANT', payload: {restaurantId: id}})
              }}
              modifyRestaurant={(restaurant: Restaurant, mealsIds: Array<Number>) => {
                send({type: 'MODIFY_RESTAURANT', payload: {restaurant: restaurant, mealsIds: mealsIds}})
              }}
              addRestaurant={(restaurant: Restaurant, mealsIds: Array<Number>) => {
                send({type: 'ADD_RESTAURANT', payload: {restaurant: restaurant, mealsIds: mealsIds}})
              }
              }>
            </Restaurants>
          </Match>

          <Match state={"orders"} current={current}>
            <Orders orders={current.context.orders}
                    modifyOrder={(id: number, status: string) => {
                      send({type: 'MODIFY_ORDER', payload: {orderId: id, status: status}})
                    }}
            >
            </Orders>
          </Match>

          <Match state={"users"} current={current}>
            <Users
              users={current.context.users}
              deleteUser={(id: number) => {
                send({
                  type: 'DELETE_USER',
                  payload: {
                    id: id
                  }
                })
              }}
              blockUser={(id: number) => {
                send({
                  type: 'BLOCK_USER',
                  payload: {
                    id: id
                  }
                })
              }}
              modifyUser={(values: ModifyUserProps) => send({
                type: 'MODIFY_USER',
                payload: values
              })}
              addUser={(values: ModifyUserProps) => send({
                type: 'ADD_USER',
                payload: values
              })}
            />
          </Match>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App;
