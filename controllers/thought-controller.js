const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThought(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    // get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: req.params.id })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thougth found' });
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
    ceateThought(req, res) {
        Thought.create(req.body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .catch(err => res.status(400).json(err));
    }
    // update thought

    // delete thougth

    // add reply

    // delete reply
}