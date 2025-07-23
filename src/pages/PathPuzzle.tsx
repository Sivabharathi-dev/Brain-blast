import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Target, RotateCcw, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type CellType = 'empty' | 'start' | 'end' | 'wall' | 'path' | 'trap';

interface Cell {
  type: CellType;
  isPath: boolean;
  isVisited: boolean;
}

const PathPuzzle = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'won' | 'lost'>('setup');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);

  const GRID_SIZE = 8;

  const levels = [
    {
      name: "Easy Path",
      grid: [
        ['S', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '#', '.', '#', '.', '#', '.', '.'],
        ['.', '#', '.', '#', '.', '#', '.', '.'],
        ['.', '#', '.', '.', '.', '#', '.', '.'],
        ['.', '.', '.', '#', '.', '.', '.', '.'],
        ['.', '#', '.', '#', '.', '#', '#', '.'],
        ['.', '#', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '#', '.', '.', '.', 'E']
      ]
    },
    {
      name: "Moderate Maze",
      grid: [
        ['S', '.', '#', '.', '.', '#', '.', '.'],
        ['#', '.', '#', '.', 'T', '#', '.', '#'],
        ['.', '.', '.', '#', '#', '.', '.', '.'],
        ['.', '#', 'T', '.', '.', '.', '#', 'T'],
        ['#', '.', '.', '#', 'T', '#', '.', '.'],
        ['.', '.', '#', '.', '.', '.', '.', '#'],
        ['.', '#', '.', 'T', '#', '.', '#', '.'],
        ['#', '.', '.', '#', '.', '.', '.', 'E']
      ]
    },
    {
      name: "Hard Challenge",
      grid: [
        ['S', '.', '#', 'T', '.', '#', '.', 'T'],
        ['#', '.', '#', '.', 'T', '#', '.', '#'],
        ['.', 'T', '.', '#', '#', '.', 'T', '.'],
        ['T', '#', '.', 'T', '.', '.', '#', 'T'],
        ['#', '.', 'T', '#', '.', '#', '.', '.'],
        ['.', '.', '#', 'T', '.', '.', 'T', '#'],
        ['T', '#', '.', '.', '#', 'T', '#', '.'],
        ['#', '.', 'T', '#', '.', '.', '.', 'E']
      ]
    }
  ];

  const initializeGrid = (levelData: string[][]) => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const cellChar = levelData[row][col];
        let cellType: CellType = 'empty';
        
        switch (cellChar) {
          case 'S': cellType = 'start'; break;
          case 'E': cellType = 'end'; break;
          case '#': cellType = 'wall'; break;
          case 'T': cellType = 'trap'; break;
          default: cellType = 'empty';
        }
        
        newGrid[row][col] = {
          type: cellType,
          isPath: false,
          isVisited: false
        };
      }
    }
    return newGrid;
  };

  const startLevel = () => {
    const levelData = levels[currentLevel];
    setGrid(initializeGrid(levelData.grid));
    setGameState('playing');
    setGameStartTime(Date.now());
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    
    const cell = grid[row][col];
    if (cell.type === 'wall') return;
    
    setIsDrawing(true);
    drawPath(row, col);
  };

  const handleCellEnter = (row: number, col: number) => {
    if (!isDrawing || gameState !== 'playing') return;
    
    const cell = grid[row][col];
    if (cell.type === 'wall') return;
    
    drawPath(row, col);
  };

  const drawPath = (row: number, col: number) => {
    const newGrid = [...grid];
    const cell = newGrid[row][col];
    
    if (cell.type === 'trap') {
      // Hit a trap - game over
      setGameState('lost');
      setIsDrawing(false);
      return;
    }
    
    if (cell.type === 'end') {
      // Check if we have a valid path from start
      if (isValidPath(newGrid)) {
        setGameState('won');
        saveGameResult(true);
      } else {
        setGameState('lost');
        saveGameResult(false);
      }
      setIsDrawing(false);
      return;
    }
    
    cell.isPath = true;
    cell.isVisited = true;
    setGrid(newGrid);
  };

  const isValidPath = (currentGrid: Cell[][]) => {
    // Find start position
    let startRow = -1, startCol = -1;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col].type === 'start') {
          startRow = row;
          startCol = col;
          break;
        }
      }
    }
    
    if (startRow === -1) return false;
    
    // BFS to check if path exists from start to end through drawn path
    const queue = [[startRow, startCol]];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      const key = `${row}-${col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      if (currentGrid[row][col].type === 'end') {
        return true;
      }
      
      // Check adjacent cells
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (
          newRow >= 0 && newRow < GRID_SIZE &&
          newCol >= 0 && newCol < GRID_SIZE &&
          !visited.has(`${newRow}-${newCol}`)
        ) {
          const nextCell = currentGrid[newRow][newCol];
          if (
            nextCell.type !== 'wall' &&
            nextCell.type !== 'trap' &&
            (nextCell.isPath || nextCell.type === 'start' || nextCell.type === 'end')
          ) {
            queue.push([newRow, newCol]);
          }
        }
      }
    }
    
    return false;
  };

  const saveGameResult = (won: boolean) => {
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const gameResult = {
      topic: 'Path Puzzle',
      type: 'Mini Game',
      score: won ? 10 : 0, // Full score for winning, 0 for losing
      total: 10,
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

  const resetLevel = () => {
    const levelData = levels[currentLevel];
    setGrid(initializeGrid(levelData.grid));
    setIsDrawing(false);
    setGameStartTime(Date.now());
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      startLevel();
    } else {
      // All levels completed
      setGameState('won');
    }
  };

  const getCellStyle = (cell: Cell, row: number, col: number) => {
    let baseStyle = "w-12 h-12 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs transition-all duration-200 ";
    
    switch (cell.type) {
      case 'start':
        baseStyle += "bg-green-500 text-white ";
        break;
      case 'end':
        baseStyle += "bg-red-500 text-white ";
        break;
      case 'wall':
        baseStyle += "bg-gray-800 dark:bg-gray-900 ";
        break;
      case 'trap':
        baseStyle += "bg-yellow-500 text-white ";
        break;
      default:
        if (cell.isPath) {
          baseStyle += "bg-blue-400 ";
        } else {
          baseStyle += "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ";
        }
    }
    
    return baseStyle;
  };

  const getCellContent = (cell: Cell) => {
    switch (cell.type) {
      case 'start': return <MapPin className="h-4 w-4" />;
      case 'end': return <Target className="h-4 w-4" />;
      case 'trap': return '⚠️';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Path Puzzle</h1>
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
        {gameState === 'setup' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-2xl">Path Puzzle Challenge</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Draw a path from start to finish while avoiding obstacles and traps!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">How to Play:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2 flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">Start point</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-2 flex items-center justify-center">
                        <Target className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">End point</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-800 rounded mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">Wall (blocked)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2 flex items-center justify-center text-xs">⚠️</div>
                      <span className="text-gray-600 dark:text-gray-400">Trap (avoid!)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>Click and drag to draw your path from the green start to the red end. Avoid walls and traps!</p>
                </div>
              </div>
              
              <Button 
                onClick={startLevel}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-lg py-3 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Level 1
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState === 'playing' && (
          <>
            {/* Game Stats */}
            <div className="flex justify-center space-x-4 mb-6">
              <Badge className="bg-blue-500 text-white px-4 py-2">
                {levels[currentLevel].name}
              </Badge>
              <Button 
                onClick={resetLevel}
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>

            {/* Game Grid */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div 
                    className="grid grid-cols-8 gap-1 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    onMouseLeave={() => setIsDrawing(false)}
                  >
                    {grid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          className={getCellStyle(cell, rowIndex, colIndex)}
                          onMouseDown={() => handleCellClick(rowIndex, colIndex)}
                          onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
                          onMouseUp={() => setIsDrawing(false)}
                        >
                          {getCellContent(cell)}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Game Over Messages */}
        {(gameState === 'won' || gameState === 'lost') && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {gameState === 'won' ? '🏆' : '💥'}
              </div>
              <CardTitle className={`text-2xl ${gameState === 'won' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {gameState === 'won' ? 'Level Complete!' : 'Try Again!'}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {gameState === 'won' 
                  ? currentLevel < levels.length - 1 
                    ? `Great job! Ready for the next challenge?`
                    : `Congratulations! You completed all levels!`
                  : 'You hit a trap or your path was invalid. Try a different route!'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-8"
                >
                  Back to Dashboard
                </Button>
                
                {gameState === 'won' && currentLevel < levels.length - 1 ? (
                  <Button 
                    onClick={nextLevel}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8"
                  >
                    Next Level
                  </Button>
                ) : (
                  <Button 
                    onClick={() => {
                      setCurrentLevel(0);
                      startLevel();
                    }}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Play Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PathPuzzle;