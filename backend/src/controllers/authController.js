const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Generate JWT Token
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

    console.log('📝 Registration attempt:', { email, requestedRole: role });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check if this is the first user ever
    const userCount = await User.countDocuments();
    console.log('👥 Total users in database:', userCount);
    
    let finalRole = 'user'; // Default role

    // CASE 1: First user becomes admin automatically
    if (userCount === 0) {
      finalRole = 'admin';
      console.log('🎉 First user - setting as ADMIN automatically');
    }
    // CASE 2: User selected admin and provided secret
    else if (role === 'admin') {
      const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';
      console.log('🔑 Admin secret check:', { provided: adminSecret, required: ADMIN_SECRET });
      
      if (adminSecret === ADMIN_SECRET) {
        finalRole = 'admin';
        console.log('✅ Valid admin secret - setting as ADMIN');
      } else {
        console.log('❌ Invalid admin secret - setting as USER');
        return res.status(403).json({
          success: false,
          message: 'Invalid admin secret key'
        });
      }
    }
    // CASE 3: Regular user
    else {
      finalRole = 'user';
      console.log('👤 Regular user - setting as USER');
    }

    console.log('🏷️ Final role to be assigned:', finalRole);

    // Create user with the determined role
    const user = await User.create({
      name,
      email,
      password,
      role: finalRole
    });

    console.log('✅ User created in database:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    // Generate token
    const token = generateToken(user._id);

    // Send response
    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // This MUST be the actual role from database
      }
    };

    console.log('📤 Sending response with role:', responseData.user.role);
    
    // Log to file
    logger.info(`✅ User registered: ${email} (Role: ${user.role})`);

    res.status(201).json(responseData);

  } catch (error) {
    console.error('❌ Registration error:', error);
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    // Check if user exists - MUST select +password to get the hashed password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ User found in DB:', { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      hasPassword: !!user.password 
    });

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    console.log('🔑 Password match:', isPasswordMatch);

    if (!isPasswordMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response with user data
    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // This comes DIRECTLY from database
      }
    };

    console.log('📤 Login response being sent:', responseData.user);
    
    // Log to file
    logger.info(`✅ User logged in: ${email} (Role: ${user.role})`);

    res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Login error:', error);
    logger.error(`Login error: ${error.message}`);
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