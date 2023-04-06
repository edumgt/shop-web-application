import React from "react";
import {Formik, Form, ErrorMessage} from "formik";
import FacebookLogin from 'react-facebook-login';
import * as Yup from 'yup';
import {Input} from "antd";

interface RegisterProps {
  onRegister: (username: string, email: string, password: string) => void
  onFacebookAuth: (username: string, email: string, photoUrl: string, accessToken: string) => void
}

const Register: React.FC<RegisterProps> = ({onRegister, onFacebookAuth}) => {

  return (
    <div className="col-md-4 mx-auto align-items-center">
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: ''
        }}
        validationSchema={
          Yup.object().shape({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
            email: Yup.string().email('Has to be a valid email.').required('Required')
          })
        }
        onSubmit={(values) => {
          onRegister(values.username, values.email, values.password)
        }}
      >
        {(props) => (
          <Form>
            <div className="form-group">
              <Input
                className="mb-2 rounded"
                value={props.values.username}
                placeholder="Username"
                name="username"
                onChange={(e: any) => props.setFieldValue('username', e.target.value)}
              />
              <ErrorMessage component="div" className="error" name="username"/>
            </div>
            <div className="form-group">
              <Input
                className="mb-2 rounded"
                value={props.values.email}
                placeholder="Email"
                name="email"
                onChange={(e: any) => props.setFieldValue('email', e.target.value)}
              />
              <ErrorMessage component="div" className="error" name="email"/>
            </div>
            <div className="form-group">
              <Input
                className="mb-2 rounded"
                value={props.values.password}
                placeholder="Password"
                name="password"
                type="password"
                onChange={(e: any) => props.setFieldValue('password', e.target.value)}
              />
              <ErrorMessage component="div" className="error" name="password"/>
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                type="submit"
              >
                <span>Register</span>
              </button>
            </div>
            <div className="form-group">
              <FacebookLogin
                appId="1788569767990308"
                autoLoad={false}
                fields="name,email,picture"
                callback={(response: any) =>
                  onFacebookAuth(response.name, response.email, response.picture.data.url, response.accessToken)}
                typeButton="primary"
                buttonStyle={{width: '100%'}}
                icon="fa-facebook"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register