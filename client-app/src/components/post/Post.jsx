import React from 'react';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import './post.scss';
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments';
import { useState } from 'react';
import moment from "moment/moment";
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from '../../../axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query'



// show of each post
const Post = ({post}) => {
    const [commnetOpen, setCommmentOpen] =  useState(false);
    const { currentUser } = useContext(AuthContext);

    const toggleComment = () => {
        setCommmentOpen(!commnetOpen)
    }

    // loading likes
    const { isLoading, error, data } = useQuery(['likes', post.id], () => 
        makeRequest.get('/likes?postId=' + post.id).then((res) => {
            return res.data;
        })
    );

    const likeData = error 
    ? 'Something went wrong!' 
    : isLoading 
    ? 'loading' 
    : data
    console.log(likeData);

    const queryClient = useQueryClient();

    // like this post or dislike
    const mutation = useMutation((liked) => {
            // if it like before another time click is dislike
            // send postId to server
            if (liked) return makeRequest.delete('/likes?postId=' + post.id);

            // like if not my postId in  this post
            return makeRequest.post('/likes', { postId: post.id });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['likes']);
            },
        }
    );

    const handleLike = (event) => {
        event.preventDefault();

        // checking before dislike that before this we like this post
        mutation.mutate(likeData.includes(currentUser.id))
    }

    return (
        <div className='post'>
            <div className="container">

                {/* imamgeUser name and time */}
                <div className="user">
                    <div className="userInfo">
                        <img src={post.profilePic} alt="" />
                        <div className="detail">
                            <Link 
                                to={`/profile/${post.id}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}
                            >
                                <span className='name'>{post.name}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <MoreHorizIcon />
                </div>

                {/* image and description */}
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={'./upload/' + post.img} alt="" />
                </div>

                {/* comment like and share */}
                <div className="info">
                    <div className="item">
                        {
                            // to checking self like
                            likeData.includes(currentUser.id) 
                            ? <FavoriteOutlinedIcon 
                                style={{color: 'red'}}
                                onClick={handleLike}
                            /> 
                            : <FavoriteBorderOutlinedIcon 
                                onClick={handleLike}
                            />
                        }
                        {likeData.length} Likes
                    </div>
                    <div className="item" onClick={toggleComment}>
                        <TextsmsOutlinedIcon />
                        12 Comments
                    </div>
                    <div className="item">
                        <ShareOutlinedIcon />
                        12 Share
                    </div>
                </div>
                {commnetOpen && <Comments postId={post.id}/>}
            </div>
        </div>
    )
}

export default Post