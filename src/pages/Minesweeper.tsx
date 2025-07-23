import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bomb, Flag, RotateCcw, Trophy } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const Minesweeper = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'won' | 'lost'>('setup');
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [minesCount, setMinesCount] = useState(10);
  const [flagsUsed, setFlagsUsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const GRID_SIZE = 9;
  const TOTAL_MINES = 10;

  useEffect(() => {
    if (gameState === 'playing' && gameStartTime > 0) {
      const timer = setInterval(() => {
        setGameTime(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, gameStartTime]);

  const initializeGrid = (): CellState[][] => {
    const newGrid: CellState[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    return newGrid;
  };

  const placeMines = (grid: CellState[][], firstClickRow: number, firstClickCol: number): CellState[][] => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < TOTAL_MINES) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      // Don't place mine on first click or if already has mine
      if (!newGrid[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && newRow < GRID_SIZE &&
                newCol >= 0 && newCol < GRID_SIZE &&
                newGrid[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newGrid[row][col].neighborMines = count;
        }
      }
    }

    return newGrid;
  };

  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing' && gameState !== 'setup') return;
    if (grid[row]?.[col]?.isRevealed || grid[row]?.[col]?.isFlagged) return;

    let newGrid = [...grid];

    // First click - initialize mines
    if (firstClick) {
      newGrid = placeMines(newGrid, row, col);
      setFirstClick(false);
      setGameStartTime(Date.now());
      setGameState('playing');
    }

    // Reveal the cell
    newGrid[row][col].isRevealed = true;

    // If it's a mine, game over
    if (newGrid[row][col].isMine) {
      setGameState('lost');
      // Reveal all mines
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
    } else if (newGrid[row][col].neighborMines === 0) {
      // Auto-reveal neighbors if no adjacent mines
      const queue = [[row, col]];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift()!;
        const key = `${currentRow}-${currentCol}`;
        
        if (visited.has(key)) continue;
        visited.add(key);

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = currentRow + i;
            const newCol = currentCol + j;
            
            if (
              newRow >= 0 && newRow < GRID_SIZE &&
              newCol >= 0 && newCol < GRID_SIZE &&
              !newGrid[newRow][newCol].isRevealed &&
              !newGrid[newRow][newCol].isFlagged &&
              !newGrid[newRow][newCol].isMine
            ) {
              newGrid[newRow][newCol].isRevealed = true;
              if (newGrid[newRow][newCol].neighborMines === 0) {
                queue.push([newRow, newCol]);
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);

    // Check win condition
    let revealedCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j].isRevealed && !newGrid[i][j].isMine) {
          revealedCount++;
        }
      }
    }

    if (revealedCount === GRID_SIZE * GRID_SIZE - TOTAL_MINES) {
      setGameState('won');
      saveGameResult(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    if (grid[row]?.[col]?.isRevealed) return;

    const newGrid = [...grid];
    const cell = newGrid[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsUsed(flagsUsed - 1);
    } else if (flagsUsed < TOTAL_MINES) {
      cell.isFlagged = true;
      setFlagsUsed(flagsUsed + 1);
    }

    setGrid(newGrid);
  };

  const saveGameResult = (won: boolean) => {
    const totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const gameResult = {
      topic: 'Minesweeper',
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

  const startNewGame = () => {
    setGrid(initializeGrid());
    setGameState('setup');
    setFlagsUsed(0);
    setGameTime(0);
    setFirstClick(true);
    setGameStartTime(0);
  };

  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) return <Flag className="h-4 w-4 text-red-500" />;
    if (!cell.isRevealed) return '';
    if (cell.isMine) return <Bomb className="h-4 w-4 text-red-600" />;
    if (cell.neighborMines > 0) return cell.neighborMines;
    return '';
  };

  const getCellStyle = (cell: CellState, row: number, col: number) => {
    let baseStyle = "w-12 h-12 border border-gray-400 dark:border-gray-600 flex items-center justify-center text-sm font-bold transition-all duration-200 ";
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        baseStyle += "bg-red-500 text-white ";
      } else {
        baseStyle += "bg-gray-100 dark:bg-gray-600 ";
        // Color code numbers
        if (cell.neighborMines === 1) baseStyle += "text-blue-600 ";
        else if (cell.neighborMines === 2) baseStyle += "text-green-600 ";
        else if (cell.neighborMines === 3) baseStyle += "text-red-600 ";
        else if (cell.neighborMines === 4) baseStyle += "text-purple-600 ";
        else if (cell.neighborMines >= 5) baseStyle += "text-yellow-600 ";
      }
    } else {
      baseStyle += "bg-gray-400 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-400 cursor-pointer ";
    }

    return baseStyle;
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (gameState === 'lost') {
      saveGameResult(false);
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-2">
                <Bomb className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Minesweeper Challenge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={startNewGame}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gameState === 'setup' && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl mb-6">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Bomb className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-2xl">Minesweeper Challenge</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Clear the minefield without detonating any bombs!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-100 dark:border-red-800">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">How to Play:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Left click to reveal a cell
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Right click to flag suspected mines
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Numbers show how many mines are adjacent
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Clear all safe cells to win!
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Click any cell to start the game</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Stats */}
        <div className="flex justify-center space-x-4 mb-6">
          <Badge className="bg-red-500 text-white px-4 py-2">
            <Bomb className="h-4 w-4 mr-2" />
            Mines: {TOTAL_MINES - flagsUsed}
          </Badge>
          <Badge className="bg-blue-500 text-white px-4 py-2">
            <Flag className="h-4 w-4 mr-2" />
            Flags: {flagsUsed}
          </Badge>
          <Badge className="bg-green-500 text-white px-4 py-2">
            Time: {gameTime}s
          </Badge>
        </div>

        {/* Game Grid */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="grid grid-cols-9 gap-1 p-6 bg-gray-200 dark:bg-gray-700 rounded-lg">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellStyle(cell, rowIndex, colIndex)}
                      onClick={() => revealCell(rowIndex, colIndex)}
                      onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                      disabled={gameState === 'won' || gameState === 'lost'}
                    >
                      {getCellContent(cell)}
                    </button>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Over Messages */}
        {(gameState === 'won' || gameState === 'lost') && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl mt-6">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">
                {gameState === 'won' ? '🏆' : '💥'}
              </div>
              <CardTitle className={`text-2xl ${gameState === 'won' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {gameState === 'won' ? 'Congratulations!' : 'Game Over!'}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {gameState === 'won' 
                  ? `You cleared the minefield in ${gameTime} seconds!` 
                  : 'You hit a mine! Better luck next time.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-8"
                >
                  Back to Dashboard
                </Button>
                
                <Button 
                  onClick={startNewGame}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-8"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
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

export default Minesweeper;