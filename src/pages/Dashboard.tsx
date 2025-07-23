import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Brain, Trophy, Clock, Target, LogOut, Play, User, TrendingUp, Star, Award, BarChart3, Search, Gamepad2, Eye, Image } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Analytics3D from '@/components/Analytics3D';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('brainBlastUser');
   
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    // Load user data with persistent localStorage data
    const userData = JSON.parse(currentUser);
    userData.username = "Sivabharathi";
    localStorage.setItem('user', JSON.stringify(userData));
    const quizzes = JSON.parse(localStorage.getItem('brainBlastQuizzes') || '[]');
    const stats = JSON.parse(localStorage.getItem('brainBlastStats') || JSON.stringify({
      totalQuizzes: 0,
      averageScore: 0,
      bestStreak: 0,
      totalTimeSpent: 0
    }));
    
    userData.quizzes = quizzes;
    userData.stats = stats;
    
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('brainBlastUser');
    navigate('/');
  };

  const quizCategories = [
    { 
      name: 'General Knowledge', 
      emoji: '🧠', 
      color: 'from-blue-400 to-purple-500',
      route: '/quiz/general'
    },
    { 
      name: 'Technology', 
      emoji: '💻', 
      color: 'from-green-400 to-blue-500',
      route: '/quiz/technology'
    },
    { 
      name: 'Movies & TV', 
      emoji: '🎬', 
      color: 'from-red-400 to-pink-500',
      route: '/quiz/movies'
    },
    { 
      name: 'Quote Quiz', 
      emoji: '💬', 
      color: 'from-yellow-400 to-orange-500',
      route: '/quiz/quotes'
    }
  ];

  const visualFunCategories = [
    { 
      name: 'Emoji Quiz', 
      emoji: '😀', 
      color: 'from-pink-400 to-purple-500',
      route: '/quiz/emoji'
    },
    { 
      name: 'Landmarks', 
      emoji: '🏛️', 
      color: 'from-cyan-400 to-blue-500',
      route: '/quiz/landmarks'
    },
    { 
      name: 'Logo Quiz', 
      emoji: '🏷️', 
      color: 'from-indigo-400 to-purple-500',
      route: '/quiz/logos'
    },
    { 
      name: 'Riddles', 
      emoji: '🧩', 
      color: 'from-purple-400 to-indigo-500',
      route: '/quiz/riddles'
    }
  ];

  const miniGames = [
    { 
      name: 'Picture Memory', 
      emoji: '📸', 
      color: 'from-emerald-400 to-teal-500',
      route: '/games/picture-memory',
      description: 'Remember what you see!'
    },
    { 
      name: 'Minesweeper', 
      emoji: '💣', 
      color: 'from-red-400 to-orange-500',
      route: '/games/minesweeper',
      description: 'Classic puzzle challenge'
    },
    { 
      name: 'Path Puzzle', 
      emoji: '🗺️', 
      color: 'from-blue-400 to-indigo-500',
      route: '/games/path-puzzle',
      description: 'Find your way through'
    },
    { 
      name: 'Unscramble Word', 
      emoji: '🔤', 
      color: 'from-violet-400 to-purple-500',
      route: '/games/unscramble',
      description: 'Rearrange the letters'
    }
  ];

  // Filter all categories based on search query
  const getFilteredCategories = () => {
    const allCategories = [...quizCategories, ...visualFunCategories, ...miniGames];
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredCategories = getFilteredCategories();

  if (!user) return null;

  const recentQuizzes = user.quizzes?.slice(-3) || [];
  const averageScore = user.stats?.averageScore || 0;
  const totalQuizzes = user.stats?.totalQuizzes || 0;
  const bestStreak = user.stats?.bestStreak || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-2">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Brain Challenge Zone
              </h1>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-80  bg-white/50  dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 dark:focus:ring-purple-400"
                />
              </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
                  <User className="text-white w-5 h-5" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user.username}</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.username}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Ready to challenge yourself with quizzes and games?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quizzes Completed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalQuizzes}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageScore.toFixed(0)}%</p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <Progress value={averageScore} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time Spent</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.floor((user.stats?.totalTimeSpent || 0) / 60)}m</p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-3">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Streak</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{bestStreak}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Choose Your Challenge */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Choose Your Challenge</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Select from quizzes, visual fun, or mini games
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {searchQuery ? (
              // Show filtered results when searching
              filteredCategories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredCategories.map((category) => (
                    <Button
                      key={category.name}
                      onClick={() => navigate(category.route)}
                      className="h-auto p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md group"
                      variant="ghost"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {category.emoji}
                      </div>
                      <div className="text-center">
                        <span className="text-gray-700 dark:text-gray-300 text-xs font-medium block">{category.name}</span>
                        {category.description && (
                          <span className="text-gray-500 dark:text-gray-500 text-xs">{category.description}</span>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No activities found</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your search terms</p>
                </div>
              )
            ) : (
              // Show all categories organized by type when not searching
              <div className="space-y-8">
                {/* Quiz Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <Brain className="h-5 w-5 mr-2 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiz</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quizCategories.map((category) => (
                      <Button
                        key={category.name}
                        onClick={() => navigate(category.route)}
                        className="h-auto p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md group"
                        variant="ghost"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {category.emoji}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Visual Fun Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <Eye className="h-5 w-5 mr-2 text-pink-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visual Fun</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {visualFunCategories.map((category) => (
                      <Button
                        key={category.name}
                        onClick={() => navigate(category.route)}
                        className="h-auto p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md group"
                        variant="ghost"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {category.emoji}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mini Games Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <Gamepad2 className="h-5 w-5 mr-2 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mini Games</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {miniGames.map((category) => (
                      <Button
                        key={category.name}
                        onClick={() => navigate(category.route)}
                        className="h-auto p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md group"
                        variant="ghost"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {category.emoji}
                        </div>
                        <div className="text-center">
                          <span className="text-gray-700 dark:text-gray-300 text-xs font-medium block">{category.name}</span>
                          <span className="text-gray-500 dark:text-gray-500 text-xs">{category.description}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div>
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white flex items-center py-2">
                      <Play className="h-5 w-5 mr-2 text-purple-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Explore your analytics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 py-9">
                  <Button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    variant="outline"
                    className="h-auto p-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105"
                  >
                    <BarChart3 className="h-8 w-8 text-white" />
                    <span className="font-semibold text-white">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Recent Quizzes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your latest quiz attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentQuizzes.length > 0 ? (
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz: any, index: number) => {
                      const percentage = Math.round((quiz.score / quiz.total) * 100);
                      const getScoreColor = (score: number) => {
                        if (score >= 90) return 'text-green-600 dark:text-green-400';
                        if (score >= 70) return 'text-blue-600 dark:text-blue-400';
                        if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
                        return 'text-red-600 dark:text-red-400';
                      };

                      const getScoreIcon = (score: number) => {
                        if (score >= 90) return '🏆';
                        if (score >= 70) return '🥈';
                        if (score >= 50) return '🥉';
                        return '📚';
                      };

                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getScoreIcon(percentage)}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{quiz.topic}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{new Date(quiz.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{quiz.type}</span>
                                <span>•</span>
                                <span>{quiz.timeSpent}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                              {percentage}%
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {quiz.score}/{quiz.total}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Play className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No quizzes completed yet</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">Start your first quiz to see your progress here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Modal */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[80vh] overflow-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                    Performance Analytics
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAnalytics(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Analytics3D />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalQuizzes}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{averageScore.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{bestStreak}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;