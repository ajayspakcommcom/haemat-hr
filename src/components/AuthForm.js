
import classes from './AuthForm.module.css';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';
import axios from "axios";

function AuthForm(props) {

  const [email, setEmail] = useState('vishal.bajaj@bsvgroup.com');
  const [password, setPassword] = useState('BSV@11223344');
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);


  const authData = {
    Username: email,
    Password: password
  };

  const loginFormHandler = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };


    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, JSON.stringify(authData), { headers });

    if (response.status === 200) {
      debugger;
      const token = response.data.Data.JwtToken;
      localStorage.setItem('token', token);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem('expiration', expiration.toISOString());
      setIsDisabled(true);
      props.onRedirect();
    }

  };


  return (
    <>
      <form className={classes.form} onSubmit={loginFormHandler}>
        <h1 className='text-center login-text'>Login</h1>
        {error && <p className='error'>{error.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <InputText type={'text'} id='email' name="email" required onChange={(e) => setEmail(e.target.value)} value={email} disabled={isDisabled} />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <InputText type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} value={password} disabled={isDisabled} />
        </p>

        <div className={classes.actions}>
          {/* <button type='submit'>Login</button> */}
          <Button label="Login" disabled={isDisabled} />
        </div>
      </form>
    </>
  )
}

export default AuthForm;
