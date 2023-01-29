import React from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import './login.scss';

const Login = () => {

    const { login } = useContext(AuthContext);

    const handleLogin = () => {
        login()
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
                        <input type="text"placeholder='Username' />
                        <input type="password" placeholder='Password' />
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;