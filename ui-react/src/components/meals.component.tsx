import React, {useState} from "react";
import {Modal, Button, Input, Card} from 'antd';
import {makeStyles} from '@material-ui/core/styles';
import {Meal} from "../models/Meal";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

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
    webkitMealSelect: 'none',
    khtmlMealSelect: 'none',
    mozMealSelect: 'none',
    msMealSelect: 'none',
    mealSelect: 'none',
  },
}));

const ModifyModal: React.FC<{
  modify: {
    id: number
    name: string
    price: number
    description: string
    visible: boolean
  }
  setModify: () => void
  modifyMeal: (values: Meal) => void
}> = ({modify, setModify, modifyMeal}) => {
  return (
    <Modal
      title={'Modify meal ' + modify.name}
      visible={modify.visible}
      footer={[
        <Button key="cancel" onClick={e => setModify()}>
          Cancel
        </Button>,
        <Button type="primary" form="modifyMealForm" key="submit" htmlType="submit">
          Submit
        </Button>
      ]}
    >
      <Formik
        initialValues={{
          id: modify.id,
          name: modify.name,
          description: modify.description,
          price: modify.price
        }}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            price: Yup.number().required("Required")
          })
        }
        onSubmit={(values) => modifyMeal(values)}
      >
        {props => (
          <Form id="modifyMealForm">
            <div className="form-group">
              <label>Name</label>
              <Field className="form-control mb-3" name="name"/>
              <ErrorMessage component="div" className="error" name="name"/>
            </div>
            <div className="form-group">
              <label>Description</label>
              <Field className="form-control mb-3" name="description"/>
              <ErrorMessage component="div" className="error" name="description"/>
            </div>
            <div className="form-group">
              <label>Price</label>
              <Field component="input" type="number" step="0.01" min="0" placeholder="Price"
                     className="form-control mb-1" name="price"/>
              <ErrorMessage component="div" className="error" name="price"/>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
const Meals: React.FC<{
  meals?: [Meal]
  deleteMeal: (id: number) => void
  modifyMeal: (meal: Meal) => void
  addMeal: (meal: Meal) => void
  canAdd?: boolean
  isInOrder?: boolean
}> = ({meals, canAdd, isInOrder, deleteMeal, modifyMeal, addMeal}) => {

  const classes = useStyles();
  const [modify, setModify] = useState({
    visible: false,
    id: 0,
    name: '',
    description: '',
    price: 0
  })
  const [addModal, setAddModal] = useState(false)

  return (
    <div className={classes.root}>
      {canAdd && isInOrder === false &&
          <Button className="unselectable rounded mb-4 mx-auto"
                  type="primary" onClick={() => setAddModal(true)}>Add meal</Button>}
      {canAdd &&
          <Modal visible={addModal} title="Add meal"
                 footer={[
                   <Button
                     form="addMealForm" key="submit" htmlType="submit">Add</Button>
                   , <Button onClick={() => setAddModal(false)}>Cancel</Button>
                 ]}
          >

              <Formik
                  initialValues={{
                    id: (undefined as unknown) as number,
                    description: (undefined as unknown) as string,
                    name: (undefined as unknown) as string,
                    price: (undefined as unknown) as number
                  }}
                  validationSchema={
                    Yup.object().shape({
                      name: Yup.string().required("Required"),
                      description: Yup.string().required("Required"),
                      price: Yup.number().required("Required")
                    })
                  }
                  onSubmit={(values) => addMeal(values)}
              >
                {props => (
                  <Form id="addMealForm" className="unselectable">
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
                    <Input
                      className="mb-2 rounded"
                      value={props.values.price}
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      name="price"
                      onChange={e => props.setFieldValue('price', e.target.value)}
                    />
                    <ErrorMessage component="div" className="error" name="price"/>
                  </Form>
                )}
              </Formik>
          </Modal>}
      <div className="site-card-wrapper flex">
        {meals?.map(meal => (
          <Card
            className="mr-5 mb-5"
            title={meal.name}
            style={isInOrder === false ? {width: 250, display: 'inline-block'} :
              {width: '100%'}}
            cover={
              isInOrder === false && <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
            }
            extra={meal.price + "$"}
            actions={[
              isInOrder === false && <EditOutlined key="edit" title="Edit" onClick={e => {
                setModify({
                  visible: true,
                  id: meal.id ?? 0,
                  name: meal.name ?? '',
                  description: meal.description ?? '',
                  price: meal.price ?? 0
                })
              }}/>,
              isInOrder === false &&
              <DeleteOutlined title="Delete" key="ellipsis" onClick={e => deleteMeal(meal.id ?? 0)}/>]}
          >
            <Meta title={meal.description}/>
            {isInOrder && <p>{"Quantity: " + meal.quantity}</p>}
          </Card>))}
      </div>
      {modify.visible && <ModifyModal
          modify={modify}
          modifyMeal={modifyMeal}
          setModify={() => setModify({
            id: 0,
            name: '',
            visible: false,
            description: '',
            price: 0
          })}/>}
    </div>
  )
}

export default Meals