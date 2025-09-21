const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create new hazard report
const createReport = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      location,
      severity,
      reporterName,
      reporterContact
    } = req.body;

    const userId = req.user?.id || null;
    const userName = req.user?.name || reporterName || 'Anonymous';

    // Insert report
    const result = await pool.query(
      `INSERT INTO hazard_reports (
        user_id, reporter_name, reporter_contact, type, title, description,
        location_lat, location_lng, location_address, severity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, created_at`,
      [
        userId,
        userName,
        reporterContact,
        type,
        title,
        description,
        location.lat,
        location.lng,
        location.address,
        severity
      ]
    );

    const report = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      report: {
        id: report.id,
        createdAt: report.created_at
      }
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report'
    });
  }
};

// Get all reports with filters
const getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      severity,
      status,
      source,
      verified,
      startDate,
      endDate,
      lat,
      lng,
      radius = 50 // km
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    // Build dynamic WHERE clause
    if (type) {
      paramCount++;
      whereConditions.push(`type = $${paramCount}`);
      queryParams.push(type);
    }

    if (severity) {
      paramCount++;
      whereConditions.push(`severity = $${paramCount}`);
      queryParams.push(severity);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (source) {
      paramCount++;
      whereConditions.push(`source = $${paramCount}`);
      queryParams.push(source);
    }

    if (verified !== undefined) {
      paramCount++;
      whereConditions.push(`verified = $${paramCount}`);
      queryParams.push(verified === 'true');
    }

    if (startDate) {
      paramCount++;
      whereConditions.push(`created_at >= $${paramCount}`);
      queryParams.push(startDate);
    }

    if (endDate) {
      paramCount++;
      whereConditions.push(`created_at <= $${paramCount}`);
      queryParams.push(endDate);
    }

    // Location-based filtering
    if (lat && lng) {
      paramCount++;
      whereConditions.push(`
        ST_DWithin(
          ST_Point(location_lng, location_lat)::geography,
          ST_Point($${paramCount}, $${paramCount + 1})::geography,
          $${paramCount + 2} * 1000
        )
      `);
      queryParams.push(lng, lat, radius);
      paramCount += 2;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hazard_reports
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get reports
    paramCount++;
    queryParams.push(limit);
    paramCount++;
    queryParams.push(offset);

    const reportsQuery = `
      SELECT 
        id, user_id, reporter_name, reporter_contact, type, title, description,
        location_lat, location_lng, location_address, severity, status, source,
        images, videos, verified, social_media_mentions, created_at, updated_at
      FROM hazard_reports
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `;

    const reportsResult = await pool.query(reportsQuery, queryParams);

    res.json({
      success: true,
      reports: reportsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
};

// Get single report
const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        id, user_id, reporter_name, reporter_contact, type, title, description,
        location_lat, location_lng, location_address, severity, status, source,
        images, videos, verified, social_media_mentions, created_at, updated_at
      FROM hazard_reports
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report: result.rows[0]
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report'
    });
  }
};

// Update report status (official only)
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verificationNotes } = req.body;

    // Check if report exists
    const reportResult = await pool.query(
      'SELECT id FROM hazard_reports WHERE id = $1',
      [id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report status
    await pool.query(
      'UPDATE hazard_reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );

    // Add verification record if provided
    if (verificationNotes) {
      await pool.query(
        `INSERT INTO report_verifications (report_id, verified_by, verification_status, verification_notes)
         VALUES ($1, $2, $3, $4)`,
        [id, req.user.id, status, verificationNotes]
      );
    }

    res.json({
      success: true,
      message: 'Report status updated successfully'
    });

  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status'
    });
  }
};

// Get reports for map (GeoJSON format)
const getReportsForMap = async (req, res) => {
  try {
    const { type, severity, status, source, verified } = req.query;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      whereConditions.push(`type = $${paramCount}`);
      queryParams.push(type);
    }

    if (severity) {
      paramCount++;
      whereConditions.push(`severity = $${paramCount}`);
      queryParams.push(severity);
    }

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }

    if (source) {
      paramCount++;
      whereConditions.push(`source = $${paramCount}`);
      queryParams.push(source);
    }

    if (verified !== undefined) {
      paramCount++;
      whereConditions.push(`verified = $${paramCount}`);
      queryParams.push(verified === 'true');
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const query = `
      SELECT 
        id, type, title, description, severity, status, source, verified,
        location_lat, location_lng, location_address, created_at
      FROM hazard_reports
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT 1000
    `;

    const result = await pool.query(query, queryParams);

    // Convert to GeoJSON format
    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(report => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [report.location_lng, report.location_lat]
        },
        properties: {
          id: report.id,
          type: report.type,
          title: report.title,
          description: report.description,
          severity: report.severity,
          status: report.status,
          source: report.source,
          verified: report.verified,
          address: report.location_address,
          createdAt: report.created_at
        }
      }))
    };

    res.json({
      success: true,
      data: geojson
    });

  } catch (error) {
    console.error('Get reports for map error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch map data'
    });
  }
};

// Get report statistics
const getReportStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_reports,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_reports,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_severity_reports,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as reports_last_24h,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as reports_last_7d,
        COUNT(CASE WHEN type = 'tsunami' THEN 1 END) as tsunami_reports,
        COUNT(CASE WHEN type = 'high-waves' THEN 1 END) as high_waves_reports,
        COUNT(CASE WHEN type = 'storm-surge' THEN 1 END) as storm_surge_reports
      FROM hazard_reports
    `;

    const result = await pool.query(statsQuery);
    const stats = result.rows[0];

    res.json({
      success: true,
      stats: {
        totalReports: parseInt(stats.total_reports),
        verifiedReports: parseInt(stats.verified_reports),
        criticalReports: parseInt(stats.critical_reports),
        highSeverityReports: parseInt(stats.high_severity_reports),
        reportsLast24h: parseInt(stats.reports_last_24h),
        reportsLast7d: parseInt(stats.reports_last_7d),
        tsunamiReports: parseInt(stats.tsunami_reports),
        highWavesReports: parseInt(stats.high_waves_reports),
        stormSurgeReports: parseInt(stats.storm_surge_reports)
      }
    });

  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReport,
  updateReportStatus,
  getReportsForMap,
  getReportStats
};
