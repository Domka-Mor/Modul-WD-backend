const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        date: {type: String, required: true},
        name: { type: String, required: true },
        surname: { type: String, required: true },
        adress: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
        task: {type: String, required: true },
        taskImage: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);