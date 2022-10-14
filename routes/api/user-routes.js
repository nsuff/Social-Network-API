const router = require('express').Router();
const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// Set up GET all and POST at /api/users
router
    .route('/')
    .get(getAllUser)
    .post(createUser);

// /api/thoughts/<thoughtId>
router
    .route('/:userId')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

// /api/comments/<pizzaId>/<commentId>/<replyId>
router.route('/:userId/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;