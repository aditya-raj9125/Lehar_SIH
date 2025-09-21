const Joi = require('joi');

// User registration validation
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    }),
  role: Joi.string().valid('citizen', 'official').default('citizen')
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Hazard report validation
const reportSchema = Joi.object({
  type: Joi.string().valid('tsunami', 'high-waves', 'storm-surge', 'coastal-damage', 'unusual-tides', 'swell-surge').required(),
  title: Joi.string().min(5).max(500).required(),
  description: Joi.string().min(10).max(2000).required(),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    address: Joi.string().min(5).max(500).required()
  }).required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  reporterName: Joi.string().min(2).max(255).when('$user', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required()
  }),
  reporterContact: Joi.string().when('$user', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required()
  })
});

// Report status update validation
const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('received', 'under-review', 'verified', 'rejected').required(),
  verificationNotes: Joi.string().max(1000).optional()
});

// Password reset validation
const passwordResetSchema = Joi.object({
  email: Joi.string().email().required()
});

const newPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    })
});

// Validation middleware factory
const validate = (schema, options = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      ...options,
      context: { user: req.user }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req.body = value;
    next();
  };
};

// File upload validation
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi'
  ];

  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB

  const files = req.files || [req.file];
  
  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type ${file.mimetype} not allowed`
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
      });
    }
  }

  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  reportSchema,
  statusUpdateSchema,
  passwordResetSchema,
  newPasswordSchema,
  validateFileUpload
};
