import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import './register.scss';

const Register = () => {

    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
        name: ''
    });

    const [error, setError] = useState(null);

    // get all inputs by only time
    // get the inputs by name in input with value 
    const handlerChange = (event) => {
        setInputs((prev) => ({ 
            ...prev, 
            [event.target.name]: event.target.value
        }))
    }

    const handlerClick = async (event) => {
        event.preventDefault();

        console.log(inputs);

        try {
            await axios.post('http://localhost:8800/api/auth/register', inputs);
        }

        catch (error) {
            console.log(error);
            setError(error.response.data);
        };
    }

    return (
        <div className='register'>
            <div className='card'>

                <div className='left'>
                    <h1>Live Event</h1>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing 
                        elit. Expedita sapiente reiciendis aspernatur facere, 
                        alias ipsum molestiae perspiciatis corporis incidunt 
                        eum sunt exercitationem tempore unde debitis obcaecati 
                        explicabo vero consequuntur? Voluptatum.
                    </p>
                    <span>Do you have account?</span>
                    <Link to='/login'>
                        <button>Login</button>
                    </Link>
                    
                </div>

                <div className='right'>
                    <h1>Register</h1>
                    <form action="">
                        <input 
                            type="text"
                            placeholder='Username' 
                            name='username' 
                            onChange={handlerChange} 
                        />
                        <input 
                            type="mail" 
                            placeholder='Email' 
                            name='email' 
                            onChange={handlerChange}
                        />
                        <input 
                            type="password" 
                            placeholder='Password' 
                            name='password' 
                            onChange={handlerChange} 
                        />
                        <input 
                            type="text" 
                            placeholder='Name' 
                            name='name' 
                            onChange={handlerChange} 
                        />
                        {error && error}
                        <button onClick={handlerClick}>Register</button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Register