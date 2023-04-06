import React from "react";
import {Formik, Form, ErrorMessage} from "formik";
import * as Yup from 'yup';
import FacebookLogin from 'react-facebook-login';
import {Input} from "antd";


interface LoginProps {
  onLogin: (userName: string, password: string) => void
  onFacebookAuth: (username: string, email: string, photoUrl: string, accessToken: string) => void
}

const Login: React.FC<LoginProps> = ({onLogin, onFacebookAuth}) => {

  return (
    <div className="col-md-4 mx-auto align-items-center">
      <Formik
        initialValues={{
          userName: '',
          password: ''
        }}
        validationSchema={
          Yup.object().shape({
            userName: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
          })
        }
        onSubmit={(values) => {
          onLogin(values.userName, values.password);
        }}
      >
        {(props) => (
          <Form>
            <div className="form-group">
              <Input
                className="mb-2 rounded"
                value={props.values.userName}
                placeholder="Username"
                name="userName"
                onChange={(e: any) => props.setFieldValue('userName', e.target.value)}
              />
              <ErrorMessage component="div" className="error" name="userName"/>
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
                <span>Login</span>
              </button>
            </div>
          </Form>

        )}
      </Formik>

      <div className="form-group">
        <FacebookLogin
          appId="1250117045637678"
          autoLoad={false}
          fields="name,email,picture"
          callback={(response: any) => onFacebookAuth(response.name, response.email, response.picture.data.url, response.accessToken)}
          typeButton="primary"
          buttonStyle={{width: '100%'}}
          icon="fa-facebook"
        />
      </div>
    </div>
  );
}

export default Login
