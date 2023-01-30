const { db } = require("../connect");
const jwt = require('jsonwebtoken');
const moment = require('moment');


exports.getPosts = (req, res) => {
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
        const q = `
            SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
            LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? 
            OR p.userId = ? ORDER BY p.createdAt DESC
        `;
        
        console.log(userInfo.id);
        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
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

