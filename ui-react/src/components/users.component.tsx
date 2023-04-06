import React, {useState} from "react";
import {Modal, Button} from 'antd';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import {UserInfo} from "../models/UserInfo";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

export interface ModifyUserProps {
  id: number
  username: string
  password: string
  email: string
  role: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "10px auto",
    maxWidth: 800,
    background: 'black'
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
    webkitUserSelect: 'none',
    khtmlUserSelect: 'none',
    mozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
}));
const Users: React.FC<{
  users?: [UserInfo]
  deleteUser: (id: number) => void
  blockUser: (id: number) => void
  modifyUser: (values: ModifyUserProps) => void
  addUser: (values: ModifyUserProps) => void
}> = ({users, deleteUser, blockUser, modifyUser, addUser}) => {

  const classes = useStyles();

  const [modify, setModify] = useState({
    visible: false,
    id: 0,
    email: '',
    password: '',
    role: '',
    name: ''
  })

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          id: 0,
          username: '',
          password: '',
          email: '',
          role: ''
        }}
        validationSchema={
          Yup.object().shape({
            username: Yup.string().required("Required"),
            email: Yup.string().email("Must be a valid email").required("Required"),
            role: Yup.string().required("Required"),
            password: Yup.string().min(6, "Password needs to have at least 6 characters").required('Required')
          })
        }
        onSubmit={(values) => addUser(values)}
      >
        {props => (
          <Form id="addUserForm" className="unselectable">
            <Paper key="addUser" className={classes.paper}>
              <Grid container spacing={2} className="pb-4 unselectable">
                <Grid item className="my-auto">
                  <ButtonBase className={classes.image}>
                    <img className={classes.img} alt="complex"
                         src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png"/>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        <div className="form-group">
                          <Field placeholder="Username" className="form-control mb-1" name="username"/>
                          <ErrorMessage
                            className="alert alert-danger" name="username"/>
                        </div>
                        <div className="form-group">
                          <Field placeholder="Email" className="form-control mb-1" name="email"/>
                          <ErrorMessage component="div" className="error" name="email"/>
                        </div>
                        <div className="form-group">
                          <select
                            placeholder="Role"
                            className="form-control mb-3 border"
                            onChange={e => props.setFieldValue('role', e.target.value)}
                            value={props.values.role}
                          >
                            <option value="" disabled>Role</option>
                            <option value="ROLE_USER">Normal user</option>
                            <option value="ROLE_OWNER"> Restaurant owner</option>
                            <option value="ROLE_ADMIN">Admin</option>
                          </select>
                          <ErrorMessage component="div" className="error" name="role"/>
                        </div>
                        <div className="form-group">
                          <Field placeholder="Password" className="form-control" name="password" component="input"
                                 type="password"/>
                          <ErrorMessage component="div" className="error" name="password"/>
                        </div>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item className="mx-4 my-auto">
                    <Typography variant="subtitle1">
                      <Button
                        form="addUserForm" key="submit" htmlType="submit"
                        shape="round" type="primary" style={{background: 'green'}}>Add user</Button>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Form>
        )}
      </Formik>
      {users?.map(user => (
        <Paper key={user.id} className={classes.paper}>
          <Grid container spacing={2} className="pb-4 unselectable">
            <Grid item className="my-auto unselectable">
              <ButtonBase className={classes.image}>
                <img className={classes.img} alt="complex"
                     src={user.photoUrl ? user.photoUrl : "https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png"}/>
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    <span className="usernameText">{user.username}</span>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.roles[0].name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" style={{cursor: 'pointer'}}>
                    <Button className="mr-4" shape="round" type="primary" style={{color: 'black'}} danger
                            onClick={e => deleteUser(user.id)}>Remove</Button>
                    <Button className="mr-4" shape="round" type="primary" onClick={e => setModify({
                      visible: true,
                      id: user.id,
                      name: user.username,
                      email: user.email,
                      role: user.roles[0].name,
                      password: ''
                    })}>Modify</Button>
                    <Button className="mr-4" shape="round" type="primary" style={{background: '#00004d'}}
                            onClick={e => blockUser(user.id)}>
                      {user.blocked === false ? "Block" : "Un-Block"}
                    </Button>

                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  <span className="emailText">
                    {user.email}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>))}
      {modify.visible && <Modal
          title={'Modify user ' + modify.name}
          visible={modify.visible}
          footer={[
            <Button key="cancel" onClick={e => setModify({
              id: 0,
              name: '',
              visible: false,
              email: '',
              role: '',
              password: ''
            })}>
              Cancel
            </Button>,
            <Button type="primary" form="modifyUserForm" key="submit" htmlType="submit">
              Submit
            </Button>
          ]}
      >
          <Formik
              initialValues={{
                id: modify.id,
                username: modify.name,
                password: '',
                email: modify.email,
                role: modify.role
              }}
              validationSchema={
                Yup.object().shape({
                  username: Yup.string().required("Required"),
                  email: Yup.string().email("Must be a valid email").required("Required"),
                  role: Yup.string().required("Required")
                })
              }
              onSubmit={(values) => modifyUser(values)}
          >
            {props => (
              <Form id="modifyUserForm">
                <div className="form-group">
                  <label>Username</label>
                  <Field className="form-control mb-3" name="username"/>
                  <ErrorMessage component="div" className="error" name="username"/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <Field className="form-control mb-3" name="email"/>
                  <ErrorMessage component="div" className="error" name="email"/>
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control mb-3 border"
                    onChange={e => props.setFieldValue('role', e.target.value)}
                    value={props.values.role}
                  >
                    <option value="ROLE_USER">Normal user</option>
                    <option value="ROLE_OWNER">Restaurant owner</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                  <ErrorMessage component="div" className="error" name="role"/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <Field placeholder="Leave blank if it should remain the same" className="form-control" name="password"
                         component="input" type="password"/>
                  <ErrorMessage component="div" className="error" name="password"/>
                </div>
              </Form>
            )}
          </Formik>
      </Modal>}
    </div>
  )
}

export default Users