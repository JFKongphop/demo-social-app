import { useContext }from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DarkModeContext } from '../../context/DarkmodeContext';
import { AuthContext } from '../../context/AuthContext';
import './navbar.scss';


const Navbar = () => {

    const { toggleDarkMode, darkMode } = useContext(DarkModeContext);
    const { currentUser } = useContext(AuthContext);
    
    const cookies = new Cookies;

    // const logoutHander = () => {
    //     localStorage.removeItem('user');
    //     console.log(cookies.get('accessToken'));
    //     cookies.remove('accessToken');
    //     window.location.reload();
    // }
 

    return (
        <div className='navbar'>
            <div className="left">
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <span>LiveSocial</span>
                </Link>
                {darkMode ? 
                    <WbSunnyOutlinedIcon onClick={toggleDarkMode} /> :
                    <DarkModeOutlinedIcon onClick={toggleDarkMode}/>
                }
                <HomeOutlinedIcon/>
                <GridViewOutlinedIcon/>
                <div className="search">
                    <SearchOutlinedIcon/>
                    <input type="text" placeholder='Search...' />
                </div>
            </div>
            <div className="right">
                <PersonOutlinedIcon/>
                <EmailOutlinedIcon/>
                <NotificationsOutlinedIcon/>
                <div className="user">
                    <img src={'/upload/' + currentUser.profilePic} alt="" />
                    <span>{currentUser.name}</span>
                </div>
            </div>
        </div>
    ) 
}

export default Navbar;