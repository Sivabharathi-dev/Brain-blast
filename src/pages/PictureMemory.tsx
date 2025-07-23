import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, EyeOff, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const PictureMemory = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'setup' | 'viewing' | 'hidden' | 'question' | 'results'>('setup');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const levels = [
    {
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600",
      question: "What is the main subject of this image?",
      options: ["Ocean waves", "Mountain landscape", "Forest trees", "Desert dunes"],
      correctAnswer: 0,
      viewTime: 10
    },
    {
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
      question: "What type of environment is shown in this image?",
      options: ["Urban city", "Dense forest", "Beach resort", "Mountain valley"],
      correctAnswer: 1,
      viewTime: 10
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      question: "What architectural style is prominently featured?",
      options: ["Gothic cathedral", "Modern skyscraper", "Opera house", "Ancient temple"],
      correctAnswer: 2,
      viewTime: 10
    },
    {
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
      question: "What is the dominant color in this landscape?",
      options: ["Blue", "Green", "Brown", "White"],
      correctAnswer: 1,
      viewTime: 10
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      question: "What time of day does this appear to be taken?",
      options: ["Early morning", "Midday", "Sunset/Evening", "Night"],
      correctAnswer: 2,
      viewTime: 10
    }
  ];

  const currentLevelData = levels[currentLevel];

  useEffect(() => {
    if (gameState === 'viewing' && timeLeft > 0) {
      // Start blinking in the last 3 seconds
      if (timeLeft <= 3) {
        setIsBlinking(true);
      }
      
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'viewing' && timeLeft === 0) {
      setIsBlinking(false);
      setGameState('hidden');
      setTimeout(() => setGameState('question'), 1000);
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('viewing');
    setTimeLeft(currentLevelData.viewTime);
    setGameStartTime(Date.now());
    setIsBlinking(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentLevelData.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setGameState('viewing');
        setTimeLeft(levels[currentLevel + 1].viewTime);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsBlinking(false);
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameState('results');
    
    // Save game result to localStorage
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const gameResult = {
      topic: 'Picture Memory',
      type: 'Mini Game',
      score,
      total: levels.length,
      timeSpent: `${totalTime}s`,
      date: new Date().toISOString(),
      answers: []
    };
    
    // Get existing quizzes and add new one
    const existingQuizzes = JSON.parse(localStorage.getItem('brainBlastQuizzes') || '[]');
    existingQuizzes.push(gameResult);
    localStorage.setItem('brainBlastQuizzes', JSON.stringify(existingQuizzes));
    
    // Update stats
    const existingStats = JSON.parse(localStorage.getItem('brainBlastStats') || JSON.stringify({
      totalQuizzes: 0,
      averageScore: 0,
      bestStreak: 0,
      totalTimeSpent: 0
    }));
    
    existingStats.totalQuizzes += 1;
    existingStats.totalTimeSpent += totalTime;
    
    // Calculate new average score
    const allScores = existingQuizzes.map((q: any) => (q.score / q.total) * 100);
    existingStats.averageScore = allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length;
    
    // Calculate best streak
    let currentStreak = 0;
    let maxStreak = 0;
    for (let i = existingQuizzes.length - 1; i >= 0; i--) {
      const quizScore = (existingQuizzes[i].score / existingQuizzes[i].total) * 100;
      if (quizScore >= 70) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    existingStats.bestStreak = Math.max(existingStats.bestStreak, maxStreak);
    
    localStorage.setItem('brainBlastStats', JSON.stringify(existingStats));
    
    // Update user object
    const user = JSON.parse(localStorage.getItem('brainBlastUser') || '{}');
    user.quizzes = existingQuizzes;
    user.stats = existingStats;
    localStorage.setItem('brainBlastUser', JSON.stringify(user));
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setGameState('setup');
    setSelectedAnswer(null);
    setShowResult(false);
    setIsBlinking(false);
  };

  const progress = ((currentLevel + 1) / levels.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-2">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Picture Memory Challenge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                Level {currentLevel + 1}/{levels.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gameState !== 'setup' && gameState !== 'results' && (
          <div className="mb-6">
            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress: {currentLevel + 1}/{levels.length}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Score: {score}/{levels.length}</span>
            </div>
          </div>
        )}

        {gameState === 'setup' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-2xl">Picture Memory Challenge</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Test your visual memory! Study each image carefully for 10 seconds, then answer questions about what you saw.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">How to Play:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    You'll see an image for 10 seconds
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    The image will blink in the last 3 seconds
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Study it carefully and remember the details
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Answer the question about what you saw
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Complete all 5 levels to finish the challenge
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-lg py-3 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState === 'viewing' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Eye className="h-6 w-6 text-emerald-500" />
                <Badge className={`${timeLeft <= 3 ? 'bg-red-500' : 'bg-emerald-500'} text-white`}>
                  <Clock className="h-4 w-4 mr-1" />
                  {timeLeft}s
                </Badge>
              </div>
              <CardTitle className="text-gray-900 dark:text-white">Study this image carefully!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <img 
                  src={currentLevelData.image} 
                  alt="Memory challenge" 
                  className={`max-w-full h-96 object-cover rounded-lg shadow-lg mx-auto transition-opacity duration-300 ${
                    isBlinking ? 'animate-pulse opacity-50' : 'opacity-100'
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {gameState === 'hidden' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <EyeOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get Ready...</h2>
              <p className="text-gray-600 dark:text-gray-400">Question coming up!</p>
            </CardContent>
          </Card>
        )}

        {gameState === 'question' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white text-xl">
                {currentLevelData.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentLevelData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`h-auto p-4 text-left justify-start transition-all duration-300 ${
                      showResult
                        ? index === currentLevelData.correctAnswer
                          ? 'bg-green-500 text-white'
                          : selectedAnswer === index
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        : selectedAnswer === index 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white ring-2 ring-emerald-300 dark:ring-emerald-600' 
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}
                    variant="ghost"
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span>{option}</span>
                    {showResult && index === currentLevelData.correctAnswer && (
                      <CheckCircle className="h-5 w-5 ml-auto" />
                    )}
                    {showResult && selectedAnswer === index && index !== currentLevelData.correctAnswer && (
                      <XCircle className="h-5 w-5 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {gameState === 'results' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {score >= 4 ? '🏆' : score >= 3 ? '🌟' : score >= 2 ? '👍' : '💪'}
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-2xl">
                Challenge Complete!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Here's how you performed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {score}/{levels.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Correct Answers</div>
                <Progress value={(score / levels.length) * 100} className="mt-4" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8"
                >
                  Back to Dashboard
                </Button>
                
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8"
                >
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PictureMemory;