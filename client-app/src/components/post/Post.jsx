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
    const [menuOpen, setMenuOpen] = useState(false);

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
    //console.log(likeData);

    const queryClient = useQueryClient();

    // like this post or dislike
    const mutation = useMutation((liked) => 
        {
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

        // check you not like yet
        mutation.mutate(likeData.includes(currentUser.id))
    }


    // delete the post
    const deleteMutation = useMutation((postId) => 
        {
            // like if not my postId in  this post
            return makeRequest.delete('/posts/' + postId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['posts']);
            },
        }
    );

    // get the data and send it to the top of deleteMutation
    const handleDelete = () => {
        if (!window.confirm('Do you want to delete')) return;
        deleteMutation.mutate(post.id)
    }


    return (
        <div className='post'>
            <div className="container">

                {/* imamgeUser name and time */}
                <div className="user">
                    <div className="userInfo">
                        <img src={
                            post.profilePic 
                            ? '/upload/' + post.profilePic 
                            : post.profilePic} alt="" 
                        />
                        <div className="detail">
                            <Link 
                                to={`/profile/${post.userId}`}
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
                    {/* will add the cnofirm when delete */}
                    <MoreHorizIcon onClick={()=>setMenuOpen(!menuOpen)}/>
                    {(menuOpen && post.userId === currentUser.id) 
                        && <button onClick={handleDelete}>delete</button>
                    }
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