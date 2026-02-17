const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    const requestedRole = role ? role.toLowerCase() : 'user';

    logger.info('📝 Registration attempt:', { name, email, requestedRole, adminSecret });

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
    
    logger.info('👥 Total users in DB:', userCount);
    
   
    if (userCount === 0) {
      userRole = 'admin';
      logger.info('🎉 First user detected - System forcing ADMIN role');
    }
    
    else if (requestedRole === 'admin') {
     
      if (adminSecret === process.env.ADMIN_SECRET) {
        userRole = 'admin';
       logger.info('👑 Admin secret verified - Granting ADMIN role');
      } else {
        logger.info('❌ Invalid admin secret provided. Input:', adminSecret);
        return res.status(403).json({
          success: false,
          message: 'Invalid admin secret key. You cannot register as admin without the correct secret.'
        });
      }
    }
    
    logger.info('🎯 Final Assigned Role:', userRole);

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
   logger.error('❌ Registration error:', error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    logger.info('🔑 Login attempt:', email);

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

    logger.info('✅ Login successful:', {
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
    logger.error('❌ Login error:', error);
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
   
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
    logger.error('❌ GetMe error:', error);
    next(error);
  }
};