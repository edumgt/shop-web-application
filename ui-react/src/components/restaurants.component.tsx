import React, {useState} from "react";
import {Modal, Button, TreeSelect, Popconfirm, Input} from 'antd';
import {makeStyles} from '@material-ui/core/styles';
import {Card} from 'antd';
import {EditOutlined, DeleteOutlined, GlobalOutlined} from '@ant-design/icons';
import {Restaurant} from "../models/Restaurant";
import {Formik, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Meal} from "../models/Meal";

const {Meta} = Card;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "10px auto",
    maxWidth: 800,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    webkitTouchcallout: 'none',
    webkitRestaurantSelect: 'none',
    khtmlRestaurantSelect: 'none',
    mozRestaurantSelect: 'none',
    msRestaurantSelect: 'none',
    restaurantSelect: 'none',
  },
}));
const Restaurants: React.FC<{
  restaurants?: [Restaurant]
  meals?: [Meal]
  isRegularUser?: boolean
  addOrder?: (meals: Array<any>, restaurantId?: number) => void
  deleteRestaurant: (id: number) => void
  modifyRestaurant: (restaurant: Restaurant, mealsIds: Array<Number>) => void
  addRestaurant: (restaurant: Restaurant, mealsIds: Array<Number>) => void
}> = ({restaurants, meals, isRegularUser, addOrder, deleteRestaurant, modifyRestaurant, addRestaurant}) => {

  const classes = useStyles();
  const [mealsModal, setMealsModal] = useState({
    visible: false,
    restaurant: {} as Restaurant,
    meals: [] as Array<Meal>
  })
  const [mealsIdsAndQuantity, setMealsIdsAndQuantity] = useState([{
    id: 0,
    quantity: 0,
    price: 0
  }])
  const [modify, setModify] = useState({
    visible: false,
    id: 0,
    description: '',
    name: '',
    mealsIds: []
  })

  function removeUndefinedFromArray(value: any) {
    if (value === undefined) return []
    else return value
  }

  const [addModal, setAddModal] = useState(false)
  return (
    <div className={classes.root}>
      {isRegularUser === false &&
          <Button className="unselectable rounded mb-4 mx-auto"
                  type="primary" onClick={() => setAddModal(true)}>Add restaurant</Button>}
      {addModal &&
          <Modal visible={addModal} title="Add restaurant"
                 footer={[
                   <Button
                     form="addRestaurantForm" key="submit" htmlType="submit">Add</Button>
                   , <Button onClick={() => setAddModal(false)}>Cancel</Button>
                 ]}
          >
              <Formik
                  initialValues={{
                    id: (undefined as unknown) as number,
                    description: (undefined as unknown) as string,
                    name: (undefined as unknown) as string,
                    mealsIds: (undefined as unknown) as Array<number>
                  }}
                  validationSchema={
                    Yup.object().shape({
                      name: Yup.string().required("Required"),
                      description: Yup.string().required("Required"),
                      mealsIds: Yup.array().required("Required")
                    })
                  }
                  onSubmit={(values) => addRestaurant(values, values.mealsIds)}
              >
                {props => (
                  <Form id="addRestaurantForm" className="unselectable">
                    <Input
                      className="mb-2 rounded"
                      value={props.values.name}
                      placeholder="Name"
                      name="name"
                      onChange={e => props.setFieldValue('name', e.target.value)}
                    />
                    <ErrorMessage component="div" className="error" name="name"/>
                    <Input
                      className="mb-2 rounded"
                      value={props.values.description}
                      placeholder="Description"
                      name="description"
                      onChange={e => props.setFieldValue('description', e.target.value)}
                    />
                    <ErrorMessage component="div" className="error" name="description"/>
                    <TreeSelect
                      showSearch
                      className="mb-2 rounded"
                      style={{width: '100%'}}
                      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      treeData={meals?.map((meal: Meal) => {
                        return {
                          title: meal.name,
                          value: meal.id,
                          key: meal.id
                        }
                      })}
                      placeholder="Select meals"
                      allowClear
                      treeCheckable={true}
                      showCheckedStrategy="SHOW_PARENT"
                      treeDefaultExpandAll
                      value={props.values.mealsIds}
                      onChange={value => props.setFieldValue("mealsIds", value)}
                    />
                    <ErrorMessage component="div" className="error" name="mealsIds"/>
                  </Form>
                )}
              </Formik>
          </Modal>}

      <div className="site-card-wrapper flex">
        {restaurants?.map(restaurant => (
          <Card
            className="mr-5 mb-5"
            style={{width: 250, display: 'inline-block'}}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <GlobalOutlined key="setting" title="Order" onClick={() => {
                setMealsModal({
                  visible: true,
                  restaurant: restaurant,
                  meals: removeUndefinedFromArray(restaurant.meals)
                })
                setMealsIdsAndQuantity(
                  removeUndefinedFromArray(restaurant.meals).map((meal: Meal) => {
                      return {
                        id: meal.id,
                        quantity: meal.quantity,
                        price: meal.price
                      }
                    }
                  ))
              }}/>,
              (isRegularUser === false)
                ? <EditOutlined key="edit" title="Edit" onClick={e => setModify({
                  visible: true,
                  id: restaurant.id ?? 0,
                  name: restaurant.name ?? '',
                  description: restaurant.description ?? '',
                  mealsIds: removeUndefinedFromArray(restaurant.meals?.map(meal => meal.id))
                })}/> : null,
              (isRegularUser === false)
                ? <DeleteOutlined title="Delete" key="ellipsis"
                                  onClick={e => deleteRestaurant(restaurant.id ?? 0)}/> : null
            ]}
          >
            <Meta
              title={restaurant.name}
              description={restaurant.description}
            />
          </Card>))}
      </div>
      {
        mealsModal.visible && <Modal
              visible={mealsModal.visible}
              style={{height: "400px", overflow: 'auto'}}
              width={320}
              title={"Order from " + mealsModal.restaurant.name}
              okText="Place order"
              footer={[
                <Popconfirm
                  key="popconfirm"
                  onConfirm={() => addOrder ? addOrder(
                    mealsIdsAndQuantity,
                    mealsModal.restaurant.id
                  ) : {}}
                  title="Are you sure you want to place this order ?">
                  <Button key="save" type="primary">
                    Place order
                  </Button>
                </Popconfirm>, <Button onClick={() => {
                  setMealsModal({visible: false, restaurant: {}, meals: []})
                  setMealsIdsAndQuantity([{id: 0, quantity: 0, price: 0}])
                }}>Cancel</Button>]}
              onCancel={() => {
                setMealsModal({visible: false, restaurant: {}, meals: []})
                setMealsIdsAndQuantity([{id: 0, quantity: 0, price: 0}])
              }
              }
          >
          {mealsModal.meals?.map((meal, index) => (
            <Card
              title={meal.name}
              type="inner"
              className="mb-1"
              style={{width: 250, display: 'inline-block'}}
              extra={meal.price + " $"}
            >
              <p>{meal.description}</p>
              <Input
                onChange={event => {
                  setMealsIdsAndQuantity(mealsIdsAndQuantity.map((value, idx) => {
                    if (index === idx) return {id: value.id, quantity: Number(event.target.value), price: value.price}
                    else return value
                  }))
                }
                }
                type="number" placeholder="Quantity" step="1"/>
            </Card>))}
          </Modal>
      }

      {
        modify.visible && <Modal
              title={'Modify restaurant ' + modify.name}
              visible={modify.visible}
              footer={[
                <Button key="cancel" onClick={e => setModify({
                  id: 0,
                  name: '',
                  visible: false,
                  description: '',
                  mealsIds: []
                })}>
                  Cancel
                </Button>,
                <Button type="primary" form="modifyRestaurantForm" key="submit" htmlType="submit">
                  Submit
                </Button>
              ]}
          >
              <Formik
                  initialValues={{
                    id: modify.id,
                    name: modify.name,
                    description: modify.description,
                    mealsIds: modify.mealsIds
                  }}
                  validationSchema={
                    Yup.object().shape({
                      name: Yup.string().required("Required"),
                      description: Yup.string().required("Required"),
                      mealsIds: Yup.array().required("Required")
                    })
                  }
                  onSubmit={(values) => modifyRestaurant(values, values.mealsIds)}
              >
                {props => (
                  <Form id="modifyRestaurantForm">
                    <div className="form-group">
                      <label>Name</label>
                      <Input
                        value={props.values.name}
                        name="name"
                        onChange={e => props.setFieldValue('name', e.target.value)}
                      />
                      <ErrorMessage component="div" className="error" name="name"/>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <Input
                        value={props.values.description}
                        name="description"
                        onChange={e => props.setFieldValue('description', e.target.value)}
                      />
                      <ErrorMessage component="div" className="error" name="description"/>
                    </div>
                    <div className="form-group">
                      <label>Meals</label>
                      <TreeSelect
                        showSearch
                        style={{width: '100%'}}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        treeData={meals?.map((meal: Meal) => {
                          return {
                            title: meal.name,
                            value: meal.id,
                            key: meal.id
                          }
                        })}
                        placeholder="Select meals"
                        allowClear
                        treeCheckable={true}
                        showCheckedStrategy="SHOW_PARENT"
                        treeDefaultExpandAll
                        value={props.values.mealsIds}
                        onChange={value => props.setFieldValue("mealsIds", value)}
                      />
                      <ErrorMessage component="div" className="error" name="mealsIds"/>
                    </div>
                  </Form>
                )}
              </Formik>
          </Modal>
      }
    </div>
  )
}

export default Restaurants