// Category Controller
// Handles all category-related operations

export async function GetAllCategories(req, res) {
  try {
    const categories = [
      {
        id: 1,
        name: 'All Mentors',
        icon: 'users',
        count: 24,
        description: 'Browse all available mentors'
      },
      {
        id: 2,
        name: 'Software Engineering',
        icon: 'code',
        count: 15,
        description: 'Learn from software engineering experts'
      },
      {
        id: 3,
        name: 'Product Management',
        icon: 'briefcase',
        count: 10,
        description: 'Get guidance from product management professionals'
      },
      {
        id: 4,
        name: 'Career Guidance',
        icon: 'compass',
        count: 18,
        description: 'Navigate your career path with expert mentors'
      },
      {
        id: 5,
        name: 'Business & Marketing',
        icon: 'trending-up',
        count: 12,
        description: 'Learn business and marketing strategies'
      },
      {
        id: 6,
        name: 'Design & UX',
        icon: 'palette',
        count: 9,
        description: 'Master design and UX principles'
      },
      {
        id: 7,
        name: 'Data Science & AI',
        icon: 'database',
        count: 14,
        description: 'Explore data science and AI technologies'
      },
      {
        id: 8,
        name: 'Web Development',
        icon: 'globe',
        count: 20,
        description: 'Learn web development from experts'
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
}

export async function GetCategoryById(req, res) {
  try {
    const { categoryId } = req.params;

    const categories = [
      {
        id: 1,
        name: 'All Mentors',
        icon: 'users',
        count: 24,
        description: 'Browse all available mentors',
        details: 'Access our complete network of experienced mentors across all domains'
      },
      {
        id: 2,
        name: 'Software Engineering',
        icon: 'code',
        count: 15,
        description: 'Learn from software engineering experts',
        details: 'Get guidance on programming, system design, and software development best practices'
      },
      {
        id: 3,
        name: 'Product Management',
        icon: 'briefcase',
        count: 10,
        description: 'Get guidance from product management professionals',
        details: 'Learn product strategy, roadmapping, and user-centric development'
      },
      {
        id: 4,
        name: 'Career Guidance',
        icon: 'compass',
        count: 18,
        description: 'Navigate your career path with expert mentors',
        details: 'Get personalized career advice and professional development guidance'
      },
      {
        id: 5,
        name: 'Business & Marketing',
        icon: 'trending-up',
        count: 12,
        description: 'Learn business and marketing strategies',
        details: 'Master business fundamentals, marketing strategies, and growth hacking'
      },
      {
        id: 6,
        name: 'Design & UX',
        icon: 'palette',
        count: 9,
        description: 'Master design and UX principles',
        details: 'Learn UI/UX design, user research, and design thinking methodologies'
      },
      {
        id: 7,
        name: 'Data Science & AI',
        icon: 'database',
        count: 14,
        description: 'Explore data science and AI technologies',
        details: 'Learn machine learning, data analysis, and AI implementation'
      },
      {
        id: 8,
        name: 'Web Development',
        icon: 'globe',
        count: 20,
        description: 'Learn web development from experts',
        details: 'Master frontend, backend, and full-stack web development'
      }
    ];

    const category = categories.find(cat => cat.id === parseInt(categoryId));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
}

export async function GetMentorsByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Mock data - will be replaced with real database queries
    const mockMentors = {
      1: [ // All Mentors
        { id: 1, name: 'John Doe', category: 'Software Engineering', rating: 4.8, reviews: 45 },
        { id: 2, name: 'Jane Smith', category: 'Product Management', rating: 4.9, reviews: 32 },
        { id: 3, name: 'Mike Johnson', category: 'Web Development', rating: 4.7, reviews: 28 }
      ],
      2: [ // Software Engineering
        { id: 1, name: 'John Doe', category: 'Software Engineering', rating: 4.8, reviews: 45 },
        { id: 4, name: 'Alex Chen', category: 'Software Engineering', rating: 4.9, reviews: 38 }
      ],
      3: [ // Product Management
        { id: 2, name: 'Jane Smith', category: 'Product Management', rating: 4.9, reviews: 32 },
        { id: 5, name: 'Sarah Williams', category: 'Product Management', rating: 4.6, reviews: 25 }
      ],
      4: [ // Career Guidance
        { id: 6, name: 'Robert Brown', category: 'Career Guidance', rating: 4.8, reviews: 40 }
      ],
      5: [ // Business & Marketing
        { id: 7, name: 'Emily Davis', category: 'Business & Marketing', rating: 4.7, reviews: 35 }
      ],
      6: [ // Design & UX
        { id: 8, name: 'Lisa Anderson', category: 'Design & UX', rating: 4.9, reviews: 30 }
      ],
      7: [ // Data Science & AI
        { id: 9, name: 'David Miller', category: 'Data Science & AI', rating: 4.8, reviews: 42 }
      ],
      8: [ // Web Development
        { id: 3, name: 'Mike Johnson', category: 'Web Development', rating: 4.7, reviews: 28 },
        { id: 10, name: 'Chris Taylor', category: 'Web Development', rating: 4.9, reviews: 36 }
      ]
    };

    const mentors = mockMentors[categoryId] || [];
    const skip = (page - 1) * limit;
    const paginatedMentors = mentors.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      message: 'Mentors fetched successfully',
      data: {
        mentors: paginatedMentors,
        total: mentors.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(mentors.length / limit)
      }
    });
  } catch (error) {
    console.error('Get mentors by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message
    });
  }
}

export async function GetCategoryStats(req, res) {
  try {
    const stats = {
      totalCategories: 8,
      totalMentors: 24,
      totalStudents: 1250,
      totalSessions: 5432,
      categories: [
        { name: 'All Mentors', count: 24 },
        { name: 'Software Engineering', count: 15 },
        { name: 'Product Management', count: 10 },
        { name: 'Career Guidance', count: 18 },
        { name: 'Business & Marketing', count: 12 },
        { name: 'Design & UX', count: 9 },
        { name: 'Data Science & AI', count: 14 },
        { name: 'Web Development', count: 20 }
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Category statistics fetched successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category statistics',
      error: error.message
    });
  }
}
