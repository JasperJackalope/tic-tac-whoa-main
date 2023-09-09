const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    habitGoal: {
        type: Number,
    },
    habits: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Habit',
        },
    ],
    diaries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Diary',
        },
    ],
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
        }
    ]
});

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;