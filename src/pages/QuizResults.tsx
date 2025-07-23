import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, RotateCcw, Home, CheckCircle, XCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, total, answers, questions, category, timeSpent } = location.state || {};
  
  const [showDetails, setShowDetails] = useState(false);
  
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent!', color: 'text-green-600 dark:text-green-400', emoji: '🏆' };
    if (percentage >= 80) return { level: 'Great Job!', color: 'text-blue-600 dark:text-blue-400', emoji: '🌟' };
    if (percentage >= 70) return { level: 'Good Work!', color: 'text-yellow-600 dark:text-yellow-400', emoji: '👍' };
    if (percentage >= 60) return { level: 'Not Bad!', color: 'text-orange-600 dark:text-orange-400', emoji: '👌' };
    return { level: 'Keep Trying!', color: 'text-red-600 dark:text-red-400', emoji: '💪' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h1 className={`text-4xl font-bold mb-2 ${performance.color}`}>
            {performance.level}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{category} Quiz Complete</p>
        </div>

        {/* Score Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900 dark:text-white text-2xl">Your Results</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Here's how you performed on this quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}/{total}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Score</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Percentage</div>
                  <Progress value={percentage} className="mt-2" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Time Taken</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Badge 
                className={`text-lg px-4 py-2 ${
                  passed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {passed ? '✅ Passed' : '❌ Try Again'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-900 dark:text-white">Question Review</CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </CardHeader>
          {showDetails && (
            <CardContent>
              <div className="space-y-4">
                {questions.map((question: any, index: number) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-gray-900 dark:text-white font-medium">
                          {index + 1}. {question.question}
                        </h4>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1" />
                        )}
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="text-gray-600 dark:text-gray-400">
                          Your answer: <span className={isCorrect ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                            {userAnswer >= 0 ? question.options[userAnswer] : 'No answer'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-gray-600 dark:text-gray-400">
                            Correct answer: <span className="text-green-600 dark:text-green-400 font-medium">
                              {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;