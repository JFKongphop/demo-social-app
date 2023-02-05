import { useQuery } from '@tanstack/react-query';
import Post from '../post/Post';
import { makeRequest } from '../../../axios';
import './posts.scss';



const Posts = ({userId}) => {
    // show only me and who following
    const { isLoading, error, data } = useQuery(['posts'], () => 
        makeRequest.get('/posts?userId=' + userId).then((res) => {
            return res.data;
            
        })
    )

    //console.log(data);


    // show all the post that occur
    const postsSlide = error 
        ? 'Something went wrong!' 
        : isLoading 
        ? 'loading' 
        : data.map((post) => (        
            <Post post={post} key={post.id}/>
        )
    )


    return (
        <div className='posts'>
            {postsSlide}
        </div>
    )
}

export default Posts