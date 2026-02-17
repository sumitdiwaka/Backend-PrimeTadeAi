const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // 1. Normalize the role to lowercase to avoid "Admin" vs "admin" issues
    const requestedRole = role ? role.toLowerCase() : 'user';

    console.log('📝 Registration attempt:', { name, email, requestedRole, adminSecret });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Determine role
    let userRole = 'user';
    const userCount = await User.countDocuments();
    
    console.log('👥 Total users in DB:', userCount);
    
    // Case 1: First user becomes admin automatically
    if (userCount === 0) {
      userRole = 'admin';
      console.log('🎉 First user detected - System forcing ADMIN role');
    }
    // Case 2: User selected admin (Check matches normalized string)
    else if (requestedRole === 'admin') {
      // ⚠️ CRITICAL: You MUST send 'adminSecret' in your request body for this to work
      if (adminSecret === process.env.ADMIN_SECRET) {
        userRole = 'admin';
        console.log('👑 Admin secret verified - Granting ADMIN role');
      } else {
        console.log('❌ Invalid admin secret provided. Input:', adminSecret);
        return res.status(403).json({
          success: false,
          message: 'Invalid admin secret key. You cannot register as admin without the correct secret.'
        });
      }
    }
    
    console.log('🎯 Final Assigned Role:', userRole);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt:', email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    console.log('✅ Login successful:', {
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);
    
    console.log('👤 GetMe - User from DB:', { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ GetMe error:', error);
    next(error);
  }
};