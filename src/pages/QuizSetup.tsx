import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Timer, ArrowLeft, Play } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const QuizSetup = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isTimedMode, setIsTimedMode] = useState(false);

  const getCategoryInfo = (cat: string) => {
    const categories: any = {
      'general': { name: 'General Knowledge', emoji: '🧠', color: 'from-blue-500 to-purple-600' },
      'technology': { name: 'Technology', emoji: '💻', color: 'from-green-500 to-blue-600' },
      'movies': { name: 'Movies & TV', emoji: '🎬', color: 'from-red-500 to-pink-600' },
      'riddles': { name: 'Riddles', emoji: '🧩', color: 'from-purple-500 to-indigo-600' },
      'quotes': { name: 'Quote Quiz', emoji: '💬', color: 'from-yellow-500 to-orange-600' },
      'emoji': { name: 'Emoji Quiz', emoji: '😀', color: 'from-pink-500 to-purple-600' },
      'landmarks': { name: 'Landmarks', emoji: '🏛️', color: 'from-cyan-500 to-blue-600' },
      'logos': { name: 'Logo Quiz', emoji: '🏷️', color: 'from-indigo-500 to-purple-600' }
    };
    return categories[cat] || categories['general'];
  };

  const categoryInfo = getCategoryInfo(category || 'general');

  const startQuiz = () => {
    navigate(`/quiz/${category}/play`, { 
      state: { 
        isTimedMode,
        category: categoryInfo.name
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Brain className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Setup</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg`}>
              {categoryInfo.emoji}
            </div>
            <CardTitle className="text-gray-900 dark:text-white text-2xl">{categoryInfo.name}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Ready to test your knowledge? Choose your preferred mode below.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Quiz Info */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Quiz Details:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="block">Questions:</span>
                  <span className="text-gray-900 dark:text-white font-medium">10 Questions</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="block">Difficulty:</span>
                  <span className="text-gray-900 dark:text-white font-medium">Mixed</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="block">Format:</span>
                  <span className="text-gray-900 dark:text-white font-medium">Multiple Choice</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="block">Scoring:</span>
                  <span className="text-gray-900 dark:text-white font-medium">1 point per correct answer</span>
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Choose Your Mode:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    !isTimedMode 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-purple-300 dark:border-purple-600 ring-2 ring-purple-300 dark:ring-purple-600' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setIsTimedMode(false)}
                >
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="text-gray-900 dark:text-white font-medium mb-1">Relaxed Mode</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Take your time to think</p>
                    {!isTimedMode && <Badge className="mt-2 bg-purple-500 text-white">Selected</Badge>}
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    isTimedMode 
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-orange-300 dark:border-orange-600 ring-2 ring-orange-300 dark:ring-orange-600' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setIsTimedMode(true)}
                >
                  <CardContent className="p-4 text-center">
                    <Timer className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h4 className="text-gray-900 dark:text-white font-medium mb-1">Timed Mode</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">10 minutes total for all questions</p>
                    {isTimedMode && <Badge className="mt-2 bg-orange-500 text-white">Selected</Badge>}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Start Button */}
            <Button 
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg py-3 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSetup;