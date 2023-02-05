import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../../axios';
import './update.scss';


const Update = ({ onOpenUpdate, user }) => {

    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
        name: '',
        city: '',
        website: ''
    });


    // upload cover and profile picture
    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await makeRequest.post('/upload', formData);
            return res.data;
        }
        catch (error) {
            console.log(error);
        }
    }


    // get input 
    const handleChange = (event) => {
        setTexts((prev) => ({ 
            ...prev, 
            [event.target.name]: event.target.value
        }));
    }

    const queryClient = useQueryClient();

    // update new profile data
    const mutation = useMutation((user) => {
            return makeRequest.put('/users', user)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['user']);
            },
        }
    );

    // submit to change the profile data
    const handleClick = async (event) => {
        event.preventDefault();

        let coverUrl;
        let profileUrl;
        coverUrl = cover ? await upload(cover) : user.coverPic;
        profileUrl = profile ? await upload(profile) : user.profilePic;
        
        mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });

        // close the update by send props
        onOpenUpdate(false);
    }

    return (
        <div className='update'>
            <div className='wrapper'>
                <form>
                    <input 
                        type='file'
                        onChange={(e)=>setCover(e.target.files[0])}
                        placeholder='cover picture'
                    />
                    <input 
                        type='file'
                        onChange={(e)=>setProfile(e.target.files[0])}
                        placeholder='profile picture'
                    />
                    <input 
                        type='text' 
                        name='name' 
                        onChange={handleChange}
                        placeholder='name'
                    />
                    <input 
                        type='text' 
                        name='city' 
                        onChange={handleChange}
                        placeholder='city'
                    />
                    <input 
                        type='text' 
                        name='website' 
                        onChange={handleChange}
                        placeholder='website'
                    />
                    <button onClick={handleClick}>Update</button>
                </form>
                <button onClick={() => onOpenUpdate(false)}>X</button>
            </div>
        </div>
    )
}

export default Update;