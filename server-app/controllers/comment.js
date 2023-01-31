const { db } = require("../connect");
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.getComments = (req, res) => {

    // the postId is matching with comment that show at this post
    const q = `
        SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
        WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;

    
    console.log('postId', req.query.postId);
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);

        //console.log(data);

        return res.status(200).json(data)
    })
}

exports.addComment = (req, res) => {
    const token = req.cookies.accessToken;

    console.log(token);

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can post and get the post
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // INSERT new post to posts table
        const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES(?, ?, ?, ?)";

        console.log(userInfo);

        const values = [
            req.body.desc,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            userInfo.id,
            req.body.postId
        ]
        
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            //console.log(data);

            return res.status(200).json("Comment has been created.")
        })
    })
}