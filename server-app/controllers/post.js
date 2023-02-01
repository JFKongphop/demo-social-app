const { db } = require("../connect");
const jwt = require('jsonwebtoken');
const moment = require('moment');


exports.getPosts = (req, res) => {

    const userId = req.query.userId;
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // get all post from all users to show by foriegnKey
        // get only the who follow
        // followerUserId is MINE
        // followedUserId is FRIENDS
        // relationships is contain me with who mine folllowing
        // respectively by date
        // if send the userId to this route that use open profile page
        // else all post
        // const q = userId 
        // ? 
        // `
        //     SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        //     WHERE p.userId = ?
        // `
        // : 
        // `
        //     SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        //     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? 
        //     OR p.userId = ? ORDER BY p.createdAt DESC
        // `;

        let values;
        let q = '';
        if (userId === 'undefined') {
            values = [userInfo.id, userInfo.id];
            q = `
                SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? 
                OR p.userId = ? ORDER BY p.createdAt DESC
            `;
        }

        else {
            values = [userId];
            q = `
                SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                WHERE p.userId = ? ORDER BY p.createdAt DESC
            `
        }
        // const values = userId ? [userId] : [userInfo.id, userInfo.id]
        // console.log('values' ,values);
        // console.log([userInfo.id, userInfo.id]);
        
        //console.log('hello' ,userInfo.id);
        console.log('values' ,values);
        console.log('userId', userId);
        
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            //console.log(data);

            return res.status(200).json(data)
        })
    })
}


// post to feed
exports.addPost = (req, res) => {
    const token = req.cookies.accessToken;

    console.log(token);

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can post and get the post
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // INSERT new post to posts table
        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES(?, ?, ?, ?)";

        console.log(req.body.desc);

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            userInfo.id
        ]
        
        console.log(userInfo.id);
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            //console.log(data);

            return res.status(200).json("Post has been created")
        })
    })
}

exports.deletePost = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json('Not logged in!');

    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // DELETE the post by get userId from who post the post
        // and the post is matching with creator
        const q = 
            "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";
        
        console.log('pp', req.params.id);
        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);

            if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");

            return res.status(403).json("You can delete only your post!");
        })
    })
}
