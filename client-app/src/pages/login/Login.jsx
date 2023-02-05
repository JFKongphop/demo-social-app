import React, { useState } from 'react';
import { useContext } from 'react';
import axios from 'axios';
import { createContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import './login.scss';

const Login = () => {

    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);

    // after login will redirect to home page
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    // get all inputs by only time
    // get the inputs by name in input with value 
    const handlerChange = (event) => {
        setInputs((prev) => ({ 
            ...prev, 
            [event.target.name]: event.target.value
        }))
    }

    // success go to home page
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            await login(inputs);
            await navigate('/');
        }

        catch (error) {
            console.log(error);
            setError(error.response.data)
        }
        
    }


    return (
        <div className='login'>
            <div className='card'>

                <div className='left'>
                    <h1>Hello world</h1>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing 
                        elit. Expedita sapiente reiciendis aspernatur facere, 
                        alias ipsum molestiae perspiciatis corporis incidunt 
                        eum sunt exercitationem tempore unde debitis obcaecati 
                        explicabo vero consequuntur? Voluptatum.
                    </p>
                    <span>Don't you have account?</span>
                    <Link to='/register'>
                        <button>Register</button>
                    </Link>
                </div>

                <div className="right">
                    <h1>Login</h1>
                    <form action="">
                        <input 
                            type="text"
                            placeholder='Username' 
                            name='username'
                            onChange={handlerChange}
                        />
                        <input 
                            type="password" 
                            placeholder='Password' 
                            name='password'
                            onChange={handlerChange}
                        />
                        {error && error}
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;