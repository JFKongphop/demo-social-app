const jwt = require('jsonwebtoken');
const { db } = require("../connect");


exports.getRelationships = (req,res)=>{
    // get the followerUserId that from followedUserId is match
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    console.log(req.query.followedUserId);
    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        
        return res.status(200).json(
            data.map(
                relationship => relationship.followerUserId
            )
        );
    });
}

exports.addRelationship = (req, res) => {    
    const token = req.cookies.accessToken;

    console.log(token);

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can post and get the post
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // INSERT new post to posts table
        const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES(?, ?)";

        console.log(userInfo);

        const values = [
            userInfo.id,
            req.body.userId
        ]
        
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Following")
        })
    })
}


exports.deleteRelationship = (req, res) => {    
    const token = req.cookies.accessToken;

    console.log(token);

    // verify before because it is login can use this
    if (!token) return res.status(401).json('Not logged in!');

    // if passing verify that can post and get the post
    jwt.verify(token, 'liveSocial', (err, userInfo) => {
        if (err) return res.status(403).json('Token is invalid');
    
        // INSERT new post to posts table
        // get followerUserId that mine
        // get followedUserId that other send from profile
        const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

        db.query(q, [userInfo.id, req.query.userId], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Unfollow")
        })
    })
}
