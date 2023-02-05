import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment/moment';
import { makeRequest } from '../../../axios';
import { AuthContext } from '../../context/AuthContext';
import './comments.scss';

// show all comments of this post
const Comments = ({postId}) => {    

    const [desc, setDesc] = useState('');
    const { currentUser } = useContext(AuthContext);

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

    
    // mapping the comment to slide it like post 
    const commentSlide = error 
        ? 'Something went wrong' 
        : isLoading 
        ? 'loading' 
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
                <img src={'/upload/' + comment.profilePic} alt="" />
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
                <img src={'/upload/' + currentUser.profilePic} alt="" />
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