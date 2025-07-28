const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ msg: 'User already exists' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, passwordHash: hash });

        res.json({ token: generateToken(user._id), user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        res.json({ token: generateToken(user._id), user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
};
