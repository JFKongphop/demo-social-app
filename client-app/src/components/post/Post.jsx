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

// show of each post
const Post = ({post}) => {
    const [commnetOpen, setCommmentOpen] =  useState(false);

    const liked = false;

    const toggleComment = () => {
        setCommmentOpen(!commnetOpen)
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
                        {liked ? 
                            <FavoriteOutlinedIcon /> :
                            <FavoriteBorderOutlinedIcon />
                        }
                        12 Likes
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