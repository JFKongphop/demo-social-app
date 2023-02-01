const express = require('express') ;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const authRoutes  = require('./routers/auth');
const userRoutes = require('./routers/users');
const postRoutes  = require('./routers/posts');
const commentRoutes  = require('./routers/comments');
const likeRoutes = require('./routers/likes');
const relationshipRoutes = require('./routers/relationships')
const multer = require('multer');


// middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(cookieParser());


// push the file to folder when add image
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, '../client-app/public/upload');
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})
  
const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/relationships', relationshipRoutes);


app.listen(8800, () => {
    console.log('running at port http://localhost:8800');
})