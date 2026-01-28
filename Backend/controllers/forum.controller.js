import ForumQuestion from '../models/forum.model.js';
import User from '../models/user.model.js';

// Get all questions
export const getAllQuestions = async (req, res) => {
  try {
    console.log('🟢 [FORUM - NODE.JS] GET /api/forum/questions - Fetching all questions');
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    let questions = await ForumQuestion.find()
      .populate('author', 'name email profilePicture')
      .populate('answers.author', 'name email profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Fetch MentorProfile pictures for question authors and answer authors
    const MentorProfile = (await import('../models/mentorProfile.model.js')).default;
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Get profile picture for question author
      if (question.author && question.author._id) {
        // First try to get from MentorProfile (for mentors)
        const mentorProfile = await MentorProfile.findOne({ user: question.author._id });
        if (mentorProfile && mentorProfile.profilePicture) {
          question.author.profilePicture = mentorProfile.profilePicture;
          console.log(`🖼️ Question author ${question.author.name} (${question.author._id}): Found in MentorProfile`);
        } else {
          // If not found in MentorProfile, use the one from User model (already populated)
          console.log(`🖼️ Question author ${question.author.name} (${question.author._id}): Using User model picture - ${question.author.profilePicture ? 'YES' : 'NO'}`);
        }
      }
      
      // Get profile pictures for answer authors
      if (question.answers && question.answers.length > 0) {
        for (let j = 0; j < question.answers.length; j++) {
          const answer = question.answers[j];
          if (answer.author && answer.author._id) {
            const mentorProfile = await MentorProfile.findOne({ user: answer.author._id });
            console.log(`🖼️ Answer author ${answer.author.name} (${answer.author._id}):`, mentorProfile?.profilePicture ? 'Found' : 'Not found');
            if (mentorProfile && mentorProfile.profilePicture) {
              answer.author.profilePicture = mentorProfile.profilePicture;
            }
          }
        }
      }
    }
    
    console.log('📋 Final questions with profile pictures:', JSON.stringify(questions.map(q => ({
      title: q.title,
      authorName: q.author?.name,
      authorPicture: q.author?.profilePicture ? 'YES' : 'NO',
      answers: q.answers?.map(a => ({
        authorName: a.author?.name,
        authorPicture: a.author?.profilePicture ? 'YES' : 'NO'
      })) || []
    })), null, 2));

    const total = await ForumQuestion.countDocuments();

    res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

// Get question by ID
export const getQuestionById = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] GET /api/forum/questions/:id - Fetching question ${req.params.id}`);
    const { id } = req.params;

    let question = await ForumQuestion.findById(id)
      .populate({
        path: 'author',
        select: 'name email profilePicture'
      })
      .populate({
        path: 'answers.author',
        select: 'name email profilePicture'
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Fetch MentorProfile pictures for answers and ensure question author has picture
    const MentorProfile = (await import('../models/mentorProfile.model.js')).default;
    
    // Check question author for MentorProfile picture
    if (question.author && question.author._id) {
      const mentorProfile = await MentorProfile.findOne({ user: question.author._id });
      if (mentorProfile && mentorProfile.profilePicture) {
        question.author.profilePicture = mentorProfile.profilePicture;
      }
    }
    
    // Check answer authors for MentorProfile pictures
    if (question.answers && question.answers.length > 0) {
      for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i];
        if (answer.author && answer.author._id) {
          const mentorProfile = await MentorProfile.findOne({ user: answer.author._id });
          if (mentorProfile && mentorProfile.profilePicture) {
            // Add profilePicture from MentorProfile if it exists
            answer.author.profilePicture = mentorProfile.profilePicture;
          }
        }
      }
    }

    // Debug: Log the answers to verify profilePicture is populated
    console.log('📋 Question answers:', JSON.stringify(question.answers, null, 2));

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
};

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    console.log('🟢 [FORUM - NODE.JS] POST /api/forum/questions - Creating new question');
    const { title, content, category, domain } = req.body;
    const authorId = req.user.id;

    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
    }

    const question = new ForumQuestion({
      title,
      content,
      category,
      domain: domain || category,
      author: authorId,
      createdAt: new Date()
    });

    await question.save();
    await question.populate('author', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
};

// Update a question
export const updateQuestion = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] PUT /api/forum/questions/:id - Updating question ${req.params.id}`);
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user.id;

    const question = await ForumQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the author
    if (question.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own questions'
      });
    }

    // Update fields
    if (title) question.title = title;
    if (content) question.content = content;
    if (category) question.category = category;

    await question.save();
    await question.populate('author', 'name email profilePicture');

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] DELETE /api/forum/questions/:id - Deleting question ${req.params.id}`);
    const { id } = req.params;
    const userId = req.user.id;

    const question = await ForumQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user is the author
    if (question.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own questions'
      });
    }

    await ForumQuestion.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
};

// Answer a question
export const answerQuestion = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] POST /api/forum/questions/:id/answer - Adding answer to question ${req.params.id}`);
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Answer content is required'
      });
    }

    const question = await ForumQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = {
      author: authorId,
      content,
      createdAt: new Date(),
      upvotes: 0
    };

    question.answers.push(answer);
    await question.save();
    await question.populate('answers.author', 'name email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Answer added successfully',
      question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding answer',
      error: error.message
    });
  }
};

// Upvote a question
export const upvoteQuestion = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] POST /api/forum/questions/:id/upvote - Upvoting question ${req.params.id}`);
    const { id } = req.params;
    const userId = req.user.id;

    const question = await ForumQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if user already upvoted
    if (question.upvoters && question.upvoters.includes(userId)) {
      // Remove upvote
      question.upvotes = Math.max(0, question.upvotes - 1);
      question.upvoters = question.upvoters.filter(id => id.toString() !== userId);
    } else {
      // Add upvote
      question.upvotes = (question.upvotes || 0) + 1;
      if (!question.upvoters) question.upvoters = [];
      question.upvoters.push(userId);
    }

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Upvote updated successfully',
      upvotes: question.upvotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error upvoting question',
      error: error.message
    });
  }
};

// Get questions by category
export const getQuestionsByCategory = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] GET /api/forum/questions/category/:category - Fetching questions by category: ${req.params.category}`);
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const questions = await ForumQuestion.find({ category })
      .populate('author', 'name email profilePicture')
      .populate('answers.author', 'name email profilePicture')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumQuestion.countDocuments({ category });

    res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions by category',
      error: error.message
    });
  }
};

// Get questions by mentor
export const getQuestionsByMentor = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] GET /api/forum/mentor/:mentorId/questions - Fetching questions by mentor ${req.params.mentorId}`);
    const { mentorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const questions = await ForumQuestion.find({ author: mentorId })
      .populate('author', 'name email profilePicture')
      .populate('answers.author', 'name email profilePicture')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumQuestion.countDocuments({ author: mentorId });

    res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mentor questions',
      error: error.message
    });
  }
};

// Search questions
export const searchQuestions = async (req, res) => {
  try {
    console.log(`🟢 [FORUM - NODE.JS] GET /api/forum/questions/search - Searching questions with query: ${req.query.q}`);
    const { q, category } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let searchQuery = {};

    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      searchQuery.category = category;
    }

    const questions = await ForumQuestion.find(searchQuery)
      .populate('author', 'name email profilePicture')
      .populate('answers.author', 'name email profilePicture')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumQuestion.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      questions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching questions',
      error: error.message
    });
  }
};
