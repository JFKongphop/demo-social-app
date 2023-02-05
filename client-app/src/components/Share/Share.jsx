import { useState, useContext } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from "../../context/AuthContext";
import { makeRequest } from "../../../axios";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import "./share.scss";


const Share = () => {

    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState("");

    // upload function
    const upload = async () => {
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

    const { currentUser } = useContext(AuthContext);

    const queryClient = useQueryClient();

    // send post request by react query
    const mutation = useMutation((newPost) => {
            return makeRequest.post('/posts', newPost)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['posts']);
            },
        }
    );

    const handleClick = async (event) => {
        event.preventDefault();
        console.log(desc);

        // upload image to db
        let imgUrl = '';
        if (file) imgUrl = await upload()
        mutation.mutate({
            desc,
            img: imgUrl
        })

        // clear value 
        setDesc('');
        setFile(null)
    }

    return (
        <div className="share">
            <div className="container">
                <div className="top">
                    <div className="left">
                        <img
                            src={'./upload/' + currentUser.profilePic}
                            alt=""
                        />
                        <input 
                            type="text" 
                            placeholder={`What's on your mind ${currentUser.name}?`} 
                            onChange={e => setDesc(e.target.value)}
                            value={desc}
                        />
                    </div>
                    <div className="right">
                        {file && <img 
                            className="file" 
                            alt=""
                            src={URL.createObjectURL(file)}
                        />}
                    </div>
                </div>

                <hr />
                <div className="bottom">
                    <div className="left">
                        <input 
                            type="file" 
                            id="file" 
                            style={{display:"none"}} 
                            onChange={e => setFile(e.target.files[0])}
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <img src={Image} alt="" />
                                <span>Add Image</span>
                            </div>
                        </label>

                        <div className="item">
                            <img src={Map} alt="" />
                            <span>Add Place</span>
                        </div>

                        <div className="item">
                            <img src={Friend} alt="" />
                            <span>Tag Friends</span>
                        </div>
                    </div>

                    <div className="right">
                        <button onClick={handleClick}>Share</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;