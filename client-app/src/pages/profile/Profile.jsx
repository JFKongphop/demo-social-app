import React from 'react';
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import Update from '../../components/update/Update';
import './profile.scss';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../../axios';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';




const Profile = () => {

    // to toggle update
    const [openUpdate, setOpenUpdate] = useState(false);

    const openUpdateHandle = (status) => {
        setOpenUpdate(status)
    }



    const { currentUser} = useContext(AuthContext);

    // get userId from the url by router
    const userId = parseInt(useLocation().pathname.split('/')[2]);
    //console.log(userId);
    const { isLoading, error, data } = useQuery(['user'], () => 
        makeRequest.get('/users/find/' + userId).then((res) => {
            return res.data;
        })
    );

    
    const profileData = error
    ? 'Something went wrong!' 
    : isLoading
    ? 'loading'
    : data
        
    console.log(profileData);


    // get followe status that we follow other
    // by userId that send to server
    const { isLoading: isLoadingR, error: errorR, data: dataR } = useQuery(['relationship'], () => 
        makeRequest.get('/relationships?followedUserId=' + userId).then((res) => {
            return res.data;
        })
    );

    const relationshipData = errorR
    ? 'Something went wrong!' 
    : isLoadingR
    ? 'loading'
    : dataR

    console.log(relationshipData);



    // follow user atprofile add follow
    const queryClient = useQueryClient();

    // follow or unfollow
    const mutation = useMutation((following) => {
            // if it like before another time click is unfollow
            // send postId to server
            if (following) return makeRequest.delete('/relationships?userId=' + userId);

            // follow if not my postId in this post
            return makeRequest.post('/relationships', { userId });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['relationship']);
            },
        }
    );

    // following user
    const handleFollow = (event) => {
        event.preventDefault();

        // checking before dislike that before this we like this post
        mutation.mutate(relationshipData.includes(currentUser.id))
    }

    
    return (
        <div className='profile'>
            <div className="images">
                <img
                    src={'/upload/' + profileData.coverPic}
                    alt=""
                    className="cover"
                />
                <img
                    src={'/upload/' + profileData.profilePic}
                    alt=""
                    className="profilePic"
                />
            </div>
            <div className="profileContainer">
                <div className="uInfo">

                    <div className="left">
                        <a href="http://facebook.com">
                            <FacebookTwoToneIcon fontSize="large" />
                        </a>
                        <a href="http://facebook.com">
                            <InstagramIcon fontSize="large" />
                        </a>
                        <a href="http://facebook.com">
                            <TwitterIcon fontSize="large" />
                        </a>
                        <a href="http://facebook.com">
                            <LinkedInIcon fontSize="large" />
                        </a>
                        <a href="http://facebook.com">
                            <PinterestIcon fontSize="large" />
                        </a>
                    </div>

                    <div className="center">
                        <span>{profileData.name}</span>
                        <div className="info">
                            <div className="item">
                                <PlaceIcon/>
                                <span>{profileData.city}</span>
                            </div>
                            <div className="item">
                                <LanguageIcon/>
                                <span>{profileData.website}</span>
                            </div>
                        </div>
                        {currentUser.id === userId 
                            ? (<button onClick={() => setOpenUpdate(true)}>Update</button>) 
                            // check we include in this relation ship to follow other user
                            : (<button onClick={handleFollow}>
                                {relationshipData.includes(currentUser.id) 
                                    ? 'Following'
                                    : 'Follow'
                                }
                            </button>)
                        }
                    </div>
                    <div className="right">
                        <EmailOutlinedIcon/>
                        <MoreVertIcon/>
                    </div>
                </div>
                {/* show only mine post when we at profile page */}
                <Posts userId={userId}/>
            </div>
            {openUpdate && 
                <Update 
                    onOpenUpdate={openUpdateHandle}
                    user={profileData}    
                />}
        </div>
    )
}

export default Profile