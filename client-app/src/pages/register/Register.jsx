import React from 'react';
import { Link } from 'react-router-dom'
import './register.scss';

const Register = () => {
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
                        <input type="text"placeholder='Username' />
                        <input type="mail" placeholder='Email' />
                        <input type="password" placeholder='Password' />
                        <input type="text" placeholder='Name' />
                        <button>Register</button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Register