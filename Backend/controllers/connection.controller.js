import Connection from '../models/connection.model.js';
import User from '../models/user.model.js';

// Connect to a mentor
const connectToMentor = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required'
      });
    }

    // Check if mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if connection already exists
    let connection = await Connection.findOne({
      student: studentId,
      mentor: mentorId
    });

    if (connection) {
      // If disconnected, reconnect
      if (connection.status === 'disconnected') {
        connection.status = 'connected';
        connection.connectedAt = new Date();
        connection.disconnectedAt = null;
        await connection.save();

        console.log(`✅ [connectToMentor] Student ${studentId} reconnected to mentor ${mentorId}`);

        return res.status(200).json({
          success: true,
          message: 'Reconnected to mentor successfully',
          data: connection
        });
      }

      // Already connected
      return res.status(400).json({
        success: false,
        message: 'Already connected to this mentor'
      });
    }

    // Create new connection
    connection = new Connection({
      student: studentId,
      mentor: mentorId,
      status: 'connected',
      connectedAt: new Date()
    });

    await connection.save();

    // Update mentor's connection count
    await User.findByIdAndUpdate(
      mentorId,
      { $inc: { connectionsCount: 1 } },
      { new: true }
    );

    console.log(`✅ [connectToMentor] Student ${studentId} connected to mentor ${mentorId}`);

    res.status(201).json({
      success: true,
      message: 'Connected to mentor successfully',
      data: connection
    });
  } catch (error) {
    console.error('❌ [connectToMentor] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to mentor',
      error: error.message
    });
  }
};

// Disconnect from a mentor
const disconnectFromMentor = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required'
      });
    }

    const connection = await Connection.findOne({
      student: studentId,
      mentor: mentorId
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: 'Connection not found'
      });
    }

    if (connection.status === 'disconnected') {
      return res.status(400).json({
        success: false,
        message: 'Already disconnected from this mentor'
      });
    }

    connection.status = 'disconnected';
    connection.disconnectedAt = new Date();
    await connection.save();

    // Update mentor's connection count
    await User.findByIdAndUpdate(
      mentorId,
      { $inc: { connectionsCount: -1 } },
      { new: true }
    );

    console.log(`✅ [disconnectFromMentor] Student ${studentId} disconnected from mentor ${mentorId}`);

    res.status(200).json({
      success: true,
      message: 'Disconnected from mentor successfully',
      data: connection
    });
  } catch (error) {
    console.error('❌ [disconnectFromMentor] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect from mentor',
      error: error.message
    });
  }
};

// Get all connections for a student
const getStudentConnections = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status = 'connected' } = req.query;

    const connections = await Connection.find({
      student: studentId,
      status: status
    })
      .populate('mentor', 'name profilePicture headline company email')
      .sort({ connectedAt: -1 });

    // Fetch mentor profile pictures from MentorProfile model and ratings
    const MentorProfile = (await import('../models/mentorProfile.model.js')).default;
    const { getMentorRatingsMap } = await import('../services/mentorRatingService.js');
    
    // Get all mentor IDs for rating lookup
    const mentorIds = connections
      .filter(conn => conn.mentor?._id)
      .map(conn => conn.mentor._id);
    
    // Fetch ratings for all mentors at once
    const ratingsMap = await getMentorRatingsMap(mentorIds);
    
    const enrichedConnections = await Promise.all(
      connections.map(async (conn) => {
        const connObj = conn.toObject();
        if (connObj.mentor) {
          // Get ratings from the ratings map
          const mentorRating = ratingsMap.get(String(connObj.mentor._id)) || { averageRating: 0, totalReviews: 0 };
          connObj.mentor.averageRating = mentorRating.averageRating;
          connObj.mentor.totalReviews = mentorRating.totalReviews;
          
          // Get profile picture from MentorProfile if not available
          if (!connObj.mentor.profilePicture || connObj.mentor.profilePicture === '') {
            const mentorProfile = await MentorProfile.findOne({ user: connObj.mentor._id }).select('profilePicture headline');
            if (mentorProfile) {
              connObj.mentor.profilePicture = mentorProfile.profilePicture || '';
              if (!connObj.mentor.headline) {
                connObj.mentor.headline = mentorProfile.headline || '';
              }
            }
          }
        }
        return connObj;
      })
    );

    console.log(`✅ [getStudentConnections] Found ${connections.length} connections for student ${studentId}`);

    res.status(200).json({
      success: true,
      count: enrichedConnections.length,
      data: enrichedConnections
    });
  } catch (error) {
    console.error('❌ [getStudentConnections] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connections',
      error: error.message
    });
  }
};

// Get all connections for a mentor (students connected to this mentor)
const getMentorConnections = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { status = 'connected' } = req.query;

    const connections = await Connection.find({
      mentor: mentorId,
      status: status
    })
      .populate('student', 'name profilePicture email phoneNumber bio goals interests headline experienceLevel')
      .sort({ connectedAt: -1 });

    console.log(`✅ [getMentorConnections] Found ${connections.length} connections for mentor ${mentorId}`);

    res.status(200).json({
      success: true,
      count: connections.length,
      data: connections
    });
  } catch (error) {
    console.error('❌ [getMentorConnections] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connections',
      error: error.message
    });
  }
};

// Check if student is connected to mentor
const checkConnection = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mentorId } = req.query;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required'
      });
    }

    const connection = await Connection.findOne({
      student: studentId,
      mentor: mentorId,
      status: 'connected'
    });

    res.status(200).json({
      success: true,
      isConnected: !!connection,
      data: connection || null
    });
  } catch (error) {
    console.error('❌ [checkConnection] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check connection',
      error: error.message
    });
  }
};

// Get mentor's connection count
const getMentorConnectionCount = async (req, res) => {
  try {
    const { mentorId } = req.query;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required'
      });
    }

    const mentor = await User.findById(mentorId).select('connectionsCount');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mentorId,
        connectionsCount: mentor.connectionsCount || 0
      }
    });
  } catch (error) {
    console.error('❌ [getMentorConnectionCount] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connection count',
      error: error.message
    });
  }
};

export {
  connectToMentor,
  disconnectFromMentor,
  getStudentConnections,
  getMentorConnections,
  checkConnection,
  getMentorConnectionCount
};
