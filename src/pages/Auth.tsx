import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, ArrowLeft, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // For testing phase, use a default user
      const defaultUser = {
        id: 1,
        username: formData.username || 'TestUser',
        email: formData.email,
        password: formData.password,
        quizzes: JSON.parse(localStorage.getItem('brainBlastQuizzes') || '[]'),
        stats: JSON.parse(localStorage.getItem('brainBlastStats') || JSON.stringify({
          totalQuizzes: 0,
          averageScore: 0,
          bestStreak: 0,
          totalTimeSpent: 0
        })),
        joinedDate: localStorage.getItem('brainBlastJoinedDate') || new Date().toISOString()
      };
      
      localStorage.setItem('brainBlastUser', JSON.stringify(defaultUser));
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${defaultUser.username}!`,
      });
      navigate('/dashboard');
    } else {
      // Register logic - same as login for testing
      const newUser = {
        id: 1,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        quizzes: [],
        stats: {
          totalQuizzes: 0,
          averageScore: 0,
          bestStreak: 0,
          totalTimeSpent: 0
        },
        joinedDate: new Date().toISOString()
      };
      
      localStorage.setItem('brainBlastUser', JSON.stringify(newUser));
      localStorage.setItem('brainBlastQuizzes', JSON.stringify([]));
      localStorage.setItem('brainBlastStats', JSON.stringify(newUser.stats));
      localStorage.setItem('brainBlastJoinedDate', newUser.joinedDate);
      
      toast({
        title: "Registration successful!",
        description: `Welcome to Brain Blast, ${newUser.username}!`,
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center mb-8">
          <div className="flex justify-center ">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-4 shadow-2xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mt-2 ml-2 ">
            Brain Challenge Zone
            </h1>
          </div>
        </div>

        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900 dark:text-white text-2xl">
              {isLogin ? 'Welcome Back!' : 'Join Brain Blast !'}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Sign in to continue your quiz journey' : 'Create your account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-medium">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required={!isLogin}
                    className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 dark:focus:ring-purple-400"
                    placeholder="Choose a username"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 dark:focus:ring-purple-400"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-400 focus:ring-purple-400 dark:focus:ring-purple-400"
                  placeholder="Enter your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <Button 
                variant="ghost" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;