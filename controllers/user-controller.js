const { Thought, User } = require('../models');

const userController = {
    // get all thoughts
    getAllUser(req, res) {
        User.find({})
            .populate({ path: 'thoughts', select: '-__v'})
            .populate({ path: 'friends', select: '-__v'})
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // get thought by id
    getUserById( req, res) {
        User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts', select: '-__v'})
        .populate({ path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create thought
    createUser(req, res) {
        User.create(req.body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { users: _id } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // update thought
    updateUser( req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { new: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete thougth
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'No thought with this id!'});
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { users: params.userId } },
                { new: true }
            );
        })
        .catch(err => res.json(err));
    },

    // add friend
    addFriend( req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .populate({ path: 'friends', select: ('-__v') } )
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // delete friend
    deleteFriend( req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .populate({ path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = userController;