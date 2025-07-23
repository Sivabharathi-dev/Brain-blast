import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Play, Trophy, Clock, Users, Star, Target, BookOpen } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('brainBlastUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
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
            <div className="flex items-center space-x-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')}
                    className="text-gray-700 "
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-6 shadow-2xl">
                <Brain className="h-20 w-20 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-6 text-white">
              Master Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Knowledge</span>
            </h1>
            <p className="text-m text-white  mb-8 max-w-2xl mx-auto">
              Challenge yourself with engaging quizzes across multiple categories. 
              Track your progress and become the ultimate quiz champion!
            </p>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              {user ? 'Continue Learning' : 'Start Your Journey'}
            </Button>
          </div>
        </div>
      </div>

 {/* Stats Section */}
 <div className="bg-white/50 backdrop-blur-lg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-600">Quizzes Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">25+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="  px-4 sm:px-6 lg:py-20 bg-blue-200 ">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Brain Challenge Zone?</h2>
          <p className="text-gray-600 text-lg">Experience the most engaging quiz platform ever created</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-gray-900">Gamified Learning</CardTitle>
              <CardDescription className="text-gray-600">
                Earn badges, track streaks, and compete on leaderboards
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-gray-900">Flexible Timing</CardTitle>
              <CardDescription className="text-gray-600">
                Choose between timed challenges or relaxed untimed mode
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-gray-900">Diverse Categories</CardTitle>
              <CardDescription className="text-gray-600">
                From tech and movies to creative emoji and quote quizzes
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Quiz Categories Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Quiz Categories</h2>
          <p className="text-gray-600 text-lg">Choose from our exciting range of quiz topics</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'General Knowledge', emoji: '🧠', color: 'from-blue-400 to-purple-500' },
            { name: 'Technology', emoji: '💻', color: 'from-green-400 to-blue-500' },
            { name: 'Movies & TV', emoji: '🎬', color: 'from-red-400 to-pink-500' },
            { name: 'Quote Quiz', emoji: '💬', color: 'from-yellow-400 to-orange-500' }
          ].map((category, index) => (
            <Card key={category.name} className="bg-white/70 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg`}>
                  {category.emoji}
                </div>
                <h3 className="text-gray-900 font-semibold text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

 {/* Visual challenge Categories Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Visual Based Fun </h2>
          <p className="text-gray-600 text-lg">Choose from our exciting range of fun elements</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
             { name: 'Emoji Quiz', emoji: '😀', color: 'from-pink-400 to-purple-500' },
             { name: 'Landmarks', emoji: '🏛️', color: 'from-cyan-400 to-blue-500' },
             { name: 'Logo Quiz', emoji: '🏷️', color: 'from-indigo-400 to-purple-500' },
             { name: 'Riddles', emoji: '🧩', color: 'from-orange-400 to-red-500' }
          ].map((category, index) => (
            <Card key={category.name} className="bg-white/70 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg`}>
                  {category.emoji}
                </div>
                <h3 className="text-gray-900 font-semibold text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

     

      {/* Footer */}
      <footer className="bg-blue-900 backdrop-blur-lg py-12 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white bg-clip-text text-transparent">
            Brain Challenge Zone
            </span>
          </div>
          <p className="text-white">© 2024 Brain Challenge Zone. Challenge your mind, expand your knowledge.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;