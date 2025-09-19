const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { validate } = require('../middleware/validation');
const { authenticateToken, requireOfficial, optionalAuth, reportRateLimit } = require('../middleware/auth');
const { reportSchema, statusUpdateSchema } = require('../middleware/validation');

// Create new report (authenticated or guest)
router.post('/', 
  reportRateLimit,
  optionalAuth,
  validate(reportSchema),
  reportController.createReport
);

// Get all reports with filters
router.get('/', 
  reportController.getReports
);

// Get single report
router.get('/:id', 
  reportController.getReport
);

// Update report status (official only)
router.put('/:id/status', 
  authenticateToken,
  requireOfficial,
  validate(statusUpdateSchema),
  reportController.updateReportStatus
);

// Get reports for map (GeoJSON format)
router.get('/map/data', 
  reportController.getReportsForMap
);

// Get report statistics
router.get('/stats/overview', 
  reportController.getReportStats
);

module.exports = router;
