const { db } = require("../connect");

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

}