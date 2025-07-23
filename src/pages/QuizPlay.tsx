import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { quizData } from '@/data/quizData';

const QuizPlay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();
  const { isTimedMode, category: categoryName } = location.state || {};
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(isTimedMode ? 600 : null); // 10 minutes total
  const [quizStartTime, setQuizStartTime] = useState(Date.now());

  const questions = quizData[category as keyof typeof quizData] || quizData.general;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (isTimedMode && timeLeft !== null) {
      if (timeLeft <= 0) {
        // Time's up - finish quiz
        finishQuiz();
        return;
      }
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isTimedMode]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const finishQuiz = () => {
    const finalAnswers = [...answers];
    finalAnswers[currentQuestion] = selectedAnswer ?? -1;
    
    const score = finalAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    
    // Save quiz result to persistent localStorage
    const quizResult = {
      topic: categoryName,
      type: isTimedMode ? 'Timed' : 'Untimed',
      score,
      total: questions.length,
      timeSpent: `${totalTime}s`,
      date: new Date().toISOString(),
      answers: finalAnswers
    };
    
    // Get existing quizzes and add new one
    const existingQuizzes = JSON.parse(localStorage.getItem('brainBlastQuizzes') || '[]');
    existingQuizzes.push(quizResult);
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
      if (quizScore >= 70) { // Consider 70% as passing
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
    
    navigate('/quiz/results', { 
      state: { 
        score, 
        total: questions.length, 
        answers: finalAnswers, 
        questions,
        category: categoryName,
        timeSpent: totalTime
      } 
    });
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer ?? -1;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{categoryName}</h1>
              <p className="text-gray-600 dark:text-gray-400">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isTimedMode && timeLeft !== null && (
                <Badge 
                  className={`${
                    timeLeft <= 60 ? 'bg-red-500' : timeLeft <= 180 ? 'bg-yellow-500' : 'bg-green-500'
                  } text-white`}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeLeft)}
                </Badge>
              )}
              <Badge variant="outline" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                {isTimedMode ? 'Timed' : 'Relaxed'} Mode
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Question Card */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="mb-8">
              {question.image && (
                <div className="mb-6 text-center">
                  <img 
                    src={question.image} 
                    alt="Question visual" 
                    className="max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {question.question}
              </h2>
              {question.context && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">{question.context}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`h-auto p-4 text-left justify-start transition-all duration-300 ${
                    selectedAnswer === index 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white ring-2 ring-purple-300 dark:ring-purple-600' 
                      : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  variant="ghost"
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Progress: {currentQuestion + 1}/{questions.length}
          </div>
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;