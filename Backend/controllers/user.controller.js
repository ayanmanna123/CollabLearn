import User from "../models/user.model.js";
import MentorSkill from "../models/mentorSkills.model.js";
import MentorProfile from "../models/mentorProfile.model.js";
import cloudinary from "../config/cloudinary.js";
import karmaService from "../services/karmaService.js";

export async function GetCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userResponse = user.toObject();

    if (user.role === 'mentor') {
      const mentorSkills = await MentorSkill.find({ mentor: user._id })
        .populate('skill', 'name');
      userResponse.skills = mentorSkills.map(ms => ms.skill);

      const mentorProfile = await MentorProfile.findOne({ user: user._id }).lean();
      userResponse.mentorProfile = mentorProfile || null;
      userResponse.isProfileComplete = mentorProfile?.isProfileComplete ?? false;
    }

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
}

export async function DeleteCurrentUser(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Lazy imports to avoid circular dependencies / unused imports
    const [{ default: Review }, { default: Message }, { default: Booking }, { default: Session }, { default: Task }, { default: Connection }, { default: JournalEntry }, { default: JournalNotes }, { default: KarmaPoints }, { default: ForumQuestion }, { default: Availability }] = await Promise.all([
      import('../models/review.model.js'),
      import('../models/message.model.js'),
      import('../models/booking.model.js'),
      import('../models/Session.model.js'),
      import('../models/task.model.js'),
      import('../models/connection.model.js'),
      import('../models/journalEntry.model.js'),
      import('../models/journalNotes.model.js'),
      import('../models/karmaPoints.model.js'),
      import('../models/forum.model.js'),
      import('../models/availability.model.js')
    ]);

    // Cleanup: delete dependent documents where safe.
    await Promise.all([
      MentorSkill.deleteMany({ mentor: userId }),
      MentorProfile.deleteOne({ user: userId }),
      Availability.deleteMany({ mentor: userId }),
      Review.deleteMany({ $or: [{ mentor: userId }, { student: userId }] }),
      Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] }),
      Task.deleteMany({ $or: [{ mentorId: userId }, { menteeId: userId }] }),
      Connection.deleteMany({ $or: [{ mentor: userId }, { student: userId }] }),
      Booking.deleteMany({ $or: [{ mentor: userId }, { student: userId }, { cancelledBy: userId }] }),
      Session.deleteMany({ $or: [{ mentor: userId }, { student: userId }] }),
      JournalEntry.deleteMany({ studentId: userId }),
      JournalNotes.deleteMany({ $or: [{ studentId: userId }, { mentorId: userId }] }),
      KarmaPoints.deleteOne({ user: userId }),
      ForumQuestion.deleteMany({ author: userId }),
      ForumQuestion.updateMany({}, { $pull: { upvoters: userId, answers: { author: userId } } })
    ]);

    await User.deleteOne({ _id: userId });

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
}

export async function UpdateCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, bio, hourlyRate } = req.validatedData;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (name) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;
    if (hourlyRate !== undefined && user.role === 'mentor') {
      if (hourlyRate < 0) {
        return res.status(400).json({
          success: false,
          message: "Hourly rate cannot be negative"
        });
      }
      user.hourlyRate = hourlyRate;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found after update"
      });
    }

    const userResponse = updatedUser.toObject();

    if (updatedUser.role === 'mentor') {
      const mentorSkills = await MentorSkill.find({ mentor: userId })
        .populate('skill', 'name');
      userResponse.skills = mentorSkills.map(ms => ms.skill);

      const mentorProfile = await MentorProfile.findOne({ user: userId }).lean();
      userResponse.mentorProfile = mentorProfile || null;
      userResponse.isProfileComplete = mentorProfile?.isProfileComplete ?? false;
    }

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error("Update current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user"
    });
  }
}

export async function UpdateStudentProfile(req, res) {
  try {
    const userId = req.user.id;
    const { bio, skills, interests, goals, phoneNumber, linkedIn, github, portfolio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Handle file upload if exists
    if (req.file) {
      try {
        // Use Cloudinary's upload_stream for buffer uploads
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "mentorlink/profile-pictures",
              width: 500,
              height: 500,
              crop: "fill",
              resource_type: "auto"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        user.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
          error: uploadError.message
        });
      }
    }

    // Update user fields
    if (bio) user.bio = bio;
    if (skills) {
      user.skills = typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : Array.isArray(skills) ? skills : [];
    }
    if (interests) {
      user.interests = typeof interests === 'string'
        ? interests.split(',').map(i => i.trim()).filter(i => i.length > 0)
        : Array.isArray(interests) ? interests : [];
    }
    if (goals) user.goals = goals;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (linkedIn) user.socialLinks.linkedIn = linkedIn;
    if (github) user.socialLinks.github = github;
    if (portfolio) user.socialLinks.portfolio = portfolio;

    // Calculate profile completion percentage
    const profileFields = {
      bio: !!user.bio,
      skills: user.skills && user.skills.length > 0,
      interests: user.interests && user.interests.length > 0,
      goals: !!user.goals,
      phoneNumber: !!user.phoneNumber,
      profilePicture: !!user.profilePicture,
      linkedIn: !!user.socialLinks?.linkedIn,
      github: !!user.socialLinks?.github
    };
    
    const completedFields = Object.values(profileFields).filter(Boolean).length;
    const totalFields = Object.keys(profileFields).length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    
    // Only mark profile as complete if at least 75% is filled
    const wasProfileComplete = user.isProfileComplete;
    user.isProfileComplete = completionPercentage >= 75;
    user.profileCompletionPercentage = completionPercentage;

    await user.save();

    // Call Java microservice to calculate karma points based on profile progress
    // Only award karma if profile wasn't already complete and now meets threshold
    if (!wasProfileComplete && user.isProfileComplete) {
      try {
        console.log('Calling Java microservice to award profile completion karma...');
        const axios = (await import('axios')).default;
        const JAVA_KARMA_API = process.env.JAVA_KARMA_API || 'http://localhost:8081/api/karma';
        
        const response = await axios.post(`${JAVA_KARMA_API}/profile-progress`, {
          completionPercentage: completionPercentage,
          completedFields: completedFields,
          totalFields: totalFields
        }, {
          timeout: 5000
        });
        
        if (response.data && response.data.karmaPoints) {
          user.karmaPoints = (user.karmaPoints || 0) + response.data.karmaPoints;
          await user.save();
          console.log(`Profile completion karma awarded: ${response.data.karmaPoints} points. Total: ${user.karmaPoints}`);
        }
      } catch (karmaError) {
        console.error('Error calling Java karma service:', karmaError.message);
      }
    }

    const updatedUser = await User.findById(userId).select('-password');
    const userResponse = updatedUser.toObject();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
      karmaPoints: userResponse.karmaPoints
    });
  } catch (error) {
    console.error("Update student profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
}
