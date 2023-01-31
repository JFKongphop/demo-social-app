const jwt = require('jsonwebtoken');
const { db } = require("../connect");

exports.getLikes = (req, res) => {    
    // select only userId column from likes table and find post id that match
    const q = "SELECT userId FROM likes WHERE postId = ?";
    
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);

        // to checking self like
        return res.status(200).json(data.map((like) => like.userId));
    })
}


exports.addLike = (req, res) => {    
    const token = req.cookies.accessToken;

    console.log(token);

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can post and get the post
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // INSERT new post to posts table
        const q = "INSERT INTO likes (`userId`, `postId`) VALUES(?, ?)";

        console.log(userInfo);

        const values = [
            userInfo.id,
            req.body.postId
        ]
        
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post has been liked.")
        })
    })
}


exports.deleteLike = (req, res) => {    
    const token = req.cookies.accessToken;

    console.log(token);

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can post and get the post
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // INSERT new post to posts table
        const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post has been disliked.")
        })
    })
}
