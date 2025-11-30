import { Router } from "express";
import { activeCheck, commentPost, createPost,delete_comment_of_user,deletePost,get_comment_by_post,getALlPosts, increament_likes } from "../controllers/posts.controller.js";
import multer from "multer";




const router = Router();
const storage = multer.diskStorage({
    destination :(req, file,cb) =>{
        cb(null, 'uploads/')
    },
    filename :(req,file,cb) =>{
        cb(null,file.originalname)
    },
});

const upload = multer({storage:storage});



router.route("/").get(activeCheck);

router.route("/post").post(upload.single('media'), createPost)
router.route("/posts").get(getALlPosts)
router.route("/delete_post").delete(deletePost)
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comment_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increament_post_likes").post(increament_likes);

export default router;