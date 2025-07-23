import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Shuffle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface WordPuzzle {
  word: string;
  hint: string;
  category: string;
}

const UnscrambleWord = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [currentWord, setCurrentWord] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);

  const words: WordPuzzle[] = [
    { word: "JAVASCRIPT", hint: "Popular programming language for web development", category: "Technology" },
    { word: "ELEPHANT", hint: "Large mammal with a trunk", category: "Animals" },
    { word: "RAINBOW", hint: "Colorful arc in the sky after rain", category: "Nature" },
    { word: "COMPUTER", hint: "Electronic device for processing data", category: "Technology" },
    { word: "BUTTERFLY", hint: "Insect with colorful wings", category: "Animals" },
    { word: "MOUNTAIN", hint: "Large natural elevation of earth", category: "Geography" },
    { word: "TELESCOPE", hint: "Instrument for viewing distant objects", category: "Science" },
    { word: "CHOCOLATE", hint: "Sweet treat made from cocoa", category: "Food" },
    { word: "ADVENTURE", hint: "Exciting or unusual experience", category: "General" },
    { word: "KEYBOARD", hint: "Input device with letters and numbers", category: "Technology" }
  ];

  const currentPuzzle = words[currentWord];

  const scrambleWord = (word: string): string[] => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  };

  const startGame = () => {
    setGameState('playing');
    setGameStartTime(Date.now());
    loadCurrentWord();
  };

  const loadCurrentWord = () => {
    setScrambledLetters(scrambleWord(currentPuzzle.word));
    setUserAnswer([]);
    setShowHint(false);
    setShowResult(false);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (showResult) return;
    
    // Move letter from scrambled to user answer
    const newScrambled = [...scrambledLetters];
    const newAnswer = [...userAnswer];
    
    newScrambled[index] = '';
    newAnswer.push(letter);
    
    setScrambledLetters(newScrambled);
    setUserAnswer(newAnswer);
    
    // Check if word is complete
    if (newAnswer.length === currentPuzzle.word.length) {
      checkAnswer(newAnswer.join(''));
    }
  };

  const handleAnswerClick = (index: number) => {
    if (showResult) return;
    
    // Move letter back to scrambled
    const letter = userAnswer[index];
    const newAnswer = [...userAnswer];
    const newScrambled = [...scrambledLetters];
    
    newAnswer.splice(index, 1);
    
    // Find first empty spot in scrambled
    const emptyIndex = newScrambled.findIndex(l => l === '');
    if (emptyIndex !== -1) {
      newScrambled[emptyIndex] = letter;
    } else {
      newScrambled.push(letter);
    }
    
    setUserAnswer(newAnswer);
    setScrambledLetters(newScrambled);
  };

  const checkAnswer = (answer: string) => {
    const isCorrect = answer === currentPuzzle.word;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        loadCurrentWord();
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
      topic: 'Unscramble Word',
      type: 'Mini Game',
      score,
      total: words.length,
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
    setCurrentWord(0);
    setScore(0);
    setGameState('setup');
    setShowResult(false);
    setShowHint(false);
  };

  const shuffleScrambled = () => {
    if (showResult) return;
    setScrambledLetters(scrambleWord(scrambledLetters.filter(l => l !== '').join('')));
  };

  const progress = ((currentWord + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl p-2">
                <Shuffle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Unscramble Word</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gameState !== 'setup' && gameState !== 'results' && (
          <div className="mb-6">
            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Word {currentWord + 1}/{words.length}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Score: {score}/{words.length}</span>
            </div>
          </div>
        )}

        {gameState === 'setup' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Shuffle className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-2xl">Unscramble Word Challenge</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Rearrange the scrambled letters to form the correct word!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-violet-100 dark:border-violet-800">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">How to Play:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                    Click letters to move them to your answer
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                    Click answer letters to move them back
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                    Use hints if you get stuck
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                    Complete all 10 words to finish the challenge
                  </li>
                </ul>
              </div>
              
              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold text-lg py-3 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState === 'playing' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Badge className="bg-violet-500 text-white px-3 py-1">
                  {currentPuzzle.category}
                </Badge>
                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Hint
                </Button>
                <Button
                  onClick={shuffleScrambled}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Shuffle
                </Button>
              </div>
              
              {showHint && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    💡 {currentPuzzle.hint}
                  </p>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* User Answer Area */}
              <div className="text-center">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Your Answer:</h3>
                <div className="flex justify-center space-x-2 min-h-[60px] items-center">
                  {Array.from({ length: currentPuzzle.word.length }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        userAnswer[index] 
                          ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-400 dark:border-violet-600' 
                          : 'hover:border-violet-300 dark:hover:border-violet-700'
                      }`}
                      onClick={() => userAnswer[index] && handleAnswerClick(index)}
                    >
                      {userAnswer[index] && (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {userAnswer[index]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrambled Letters */}
              <div className="text-center">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Available Letters:</h3>
                <div className="flex justify-center flex-wrap gap-2">
                  {scrambledLetters.map((letter, index) => (
                    <Button
                      key={index}
                      onClick={() => letter && handleLetterClick(letter, index)}
                      disabled={!letter || showResult}
                      className={`w-12 h-12 text-lg font-bold transition-all duration-300 ${
                        letter
                          ? 'bg-white dark:bg-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900/30 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-600 hover:scale-110'
                          : 'invisible'
                      }`}
                      variant="ghost"
                    >
                      {letter}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Result Display */}
              {showResult && (
                <div className="text-center">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    userAnswer.join('') === currentPuzzle.word
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}>
                    {userAnswer.join('') === currentPuzzle.word ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        <span className="font-semibold">The word was: {currentPuzzle.word}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {gameState === 'results' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {score >= 8 ? '🏆' : score >= 6 ? '🌟' : score >= 4 ? '👍' : '💪'}
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
                <div className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                  {score}/{words.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Words Unscrambled</div>
                <Progress value={(score / words.length) * 100} className="mt-4" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold px-8"
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

export default UnscrambleWord;