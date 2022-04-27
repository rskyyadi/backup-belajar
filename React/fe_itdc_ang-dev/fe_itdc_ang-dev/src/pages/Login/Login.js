import React, { 
  useState,
  useContext 
} from "react"
import {  
  Col
} from "react-bootstrap"
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from "react-icons/io5"
import { 
  Formik 
} from "formik"
import * as Yup from "yup"
import JWTDecode from "jwt-decode"
import { ActionButton } from "components"
import { AuthMethod, AuthContext } from "utilities"
import { AuthApi } from "api"
import Config from "config"


const Login = () => {
  const { dispatch } = useContext(AuthContext)
  const { MODUL } = Config
  const Input = props => (
    <div className="mb-3">
      <div className="input-group input-group-sm">
        <div className="input-group-prepend">
          <span className={`input-group-text bg-white ${props.error ? 'border border-danger' : ''}`}>
            {props.icon}
          </span>
        </div>
        <input 
          {...props}
          className={`form-control ${props.error ? 'is-invalid' : ''}`}
          style={{borderLeft: 'none'}}
        />
      </div>
      {props.error && (
        <div class="text-danger">
          <small>{props.errorText}</small>
        </div>
      )}
    </div>
  )

  const InputPassword = props => {
    const [showPass, setShowPass] = useState(false)

    return (
      <div className="mb-3">
        <div className="input-group input-group-sm">
          <div className="input-group-prepend">
            <span className={`input-group-text bg-white ${props.error ? 'border border-danger' : ''}`}>
              {props.icon}
            </span>
          </div>
          <input 
            {...props}
            type={showPass ? 'text' : 'password'}
            className={`form-control ${props.error ? 'is-invalid' : ''}`}
            style={{
              borderLeft: 'none',
              borderRight: 'none',
            }}
          />
          <div className="input-group-append" 
            style={{cursor: 'pointer'}}
            onClick={() => setShowPass(!showPass)}
          >
            <span className={`input-group-text bg-white ${props.error ? 'border border-danger' : ''}`}>
              {showPass ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
        </div>
        {props.error && (
          <div class="text-danger">
            <small>{props.errorText}</small>
          </div>
        )}
      </div>
    )
  }

  const LogoSection = () => (
    <div sm={3} className="d-flex flex-column justify-content-center align-items-center">
      <img src={Config.LOGO} width={120} />
      <div className="pt-2 text-center" style={{width: '100%'}}>
        <b className="text-uppercase">LOGIN {MODUL}</b>
      </div>
    </div>
  )

  const FormSection = () =>  {
    const formInitialValues = {
      username: "",
      password: ""
    }
  
    const formValidationSchema = Yup.object().shape({
      username: Yup.string().required("Masukan username"),
      password: Yup.string().required("Masukan password"),
    })
  
    const formSubmitHandler = (value, { resetForm }) => {
      AuthApi.login(value)
        .then((res) => {
          const token = res.data.token
          const decode = JWTDecode(token)
          const { username, hak } = decode
  
          dispatch({
            type: AuthMethod.LOGIN,
            payload: {
              isAuthenticated: true,
              token: token,
              username: username,
              role: hak,
            },
          })
        })
        .catch(() => {
          resetForm({
            values: {
              username: value.username,
              password: "",
            },
            errors: {
              username: "Username dan password tidak cocok",
              password: true,
            },
            touched: {
              username: true,
              password: true,
            },
          })
        })
    }

    return(
      <Formik
        initialValues={formInitialValues}
        validationSchema={formValidationSchema}
        onSubmit={formSubmitHandler}
      >
        {({ values, errors, touched, isSubmitting, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <hr />
            <Input
              icon={<IoPersonOutline />}
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              error={errors.username && touched.username && true}
              errorText={errors.username}
            />
            <InputPassword
              icon={<IoLockClosedOutline />}
              type="text"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              error={errors.password && touched.password && true}
              errorText={errors.password}
            />
            <ActionButton 
              type="submit" 
              text="Login" 
              className="col mt-2" 
              loading={isSubmitting}
            />
          </form>
        )}
      </Formik>
    )
  }
  

  return (
    <div 
      className="d-flex justify-content-center align-items-center p-3"
      style={{height: '100vh', width: '100vw'}}
    >
      <Col xs={12} sm={6} md={4} lg={3} className="py-4 bg-white rounded shadow">
        <LogoSection />
        <FormSection />
      </Col>
    </div>
  )
}
export default Login