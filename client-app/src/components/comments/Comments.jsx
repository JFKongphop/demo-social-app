import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { makeRequest } from '../../../axios';
import { AuthContext } from '../../context/AuthContext';
import './comments.scss';
import moment from 'moment/moment';

// dummy data
const comments = [
    {
        id: 1,
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
        name: "John Doe",
        userId: 1,
        profilePicture:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
        id: 2,
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
        name: "Jane Doe",
        userId: 2,
        profilePicture:
            "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
];

// show all comments of this post
const Comments = ({postId}) => {    

    const [desc, setDesc] = useState('');

    // render comment like posts
    // send the postId to server to get the relation with the post at comment
    const { isLoading, error, data } = useQuery(['comments'], () => 
        makeRequest.get('/comments?postId=' + postId).then((res) => {
            return res.data;
        })
    );

    const queryClient = useQueryClient();

    // send comment request by react query
    const mutation = useMutation((newComment) => {
            return makeRequest.post('/comments', newComment)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['comments']);
            },
        }
    );

    const handleClick = async (event) => {
        event.preventDefault();

        // send data to server
        mutation.mutate({
            desc,
            postId
        })

        // clear value 
        setDesc('');
    }


    const { currentUser } = useContext(AuthContext);
    
    // mapping the comment to slide it like post 
    const commentSlide = error 
        ? 'Something went wrong' 
        : isLoading 
        ? 'loading' 
        : data.map((comment) => (
            <div className="comment">
                <img src={comment.profilePicture} alt="" />
                <div className="info">
                    <span>{comment.name}</span>
                    <p>{comment.desc}</p>
                </div>
                <span className='date'>{moment(comment.createdAt).fromNow()}</span>
            </div>
        )
    )

    return (
        <div className='comments'>
            <div className="write">
                <img src={currentUser.profilePic} alt="" />
                <input 
                    type="text" 
                    placeholder='comment'
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <button onClick={handleClick}>Send</button>
            </div>
            {commentSlide}
        </div>
    )
}

export default Comments