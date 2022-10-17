const { Thought, User } = require('../models');
const { populate } = require('../models/Thought');

const thoughtController = {
    // get all thoughts
    getAllThought(req, res) {
        Thought.find({})
            .populate({ path: 'reactions', select: '-__v'})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // get thought by id
    getThoughtById( req, res) {
        Thought.findOne({ _id: req.params.id })
        .populate({ path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create thought
    createThought( req, res) {
        Thought.create(req.body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No user found with this id!, blueberry'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    // // create thought
    // createThought({params, body}, res) {
    //     Thought.create(body)
    //     .then(({ _id}) => {
    //         return User.findOneAndUpdate(
    //             { _id: params.body.userId },
    //             { $push: { thoughts: _id } },
    //             { new: true }
    //         );
    //     })
    //     .then(dbThoughtData => {
    //         if (!dbThoughtData) {
    //             res.status(404).json({message: 'No user found with this id!, blueberry'});
    //             return;
    //         }
    //         res.json(dbThoughtData)
    //     })
    //     .catch(err => res.status(400).json(err));
    // },

    // update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete thougth
    deleteThought({params}, res) {
        Thought.findOneAndDelete(
            { _id: params.id }
            )
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id!'});
            }
            res.json(deletedThought);
        })
        .catch(err => res.json(err));
    },

    // add reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: {reactions: body } },
            { new: true, runValidators: true }
        )
        //populate({ path: 'reactions', select: '-__v' })
        //select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // delete reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No reaction found with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;