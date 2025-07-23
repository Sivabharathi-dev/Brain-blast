import { useEffect, useRef } from 'react';

const Analytics3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get user stats from localStorage
    const getUserStats = () => {
      const stats = JSON.parse(localStorage.getItem('brainBlastStats') || '{}');
      const quizzes = JSON.parse(localStorage.getItem('brainBlastQuizzes') || '[]');
      
      // Calculate category performance
      const categoryStats = {
        'General Knowledge': 0,
        'Technology': 0,
        'Movies & TV': 0,
        'Quote Quiz': 0,
        'Visual Fun': 0
      };
      
      const categoryCounts = {
        'General Knowledge': 0,
        'Technology': 0,
        'Movies & TV': 0,
        'Quote Quiz': 0,
        'Visual Fun': 0
      };

      quizzes.forEach((quiz: any) => {
        const category = quiz.topic;
        const score = (quiz.score / quiz.total) * 100;
        
        if (categoryStats.hasOwnProperty(category)) {
          categoryStats[category] += score;
          categoryCounts[category]++;
        } else {
          // Group visual categories
          categoryStats['Visual Fun'] += score;
          categoryCounts['Visual Fun']++;
        }
      });

      // Calculate averages
      Object.keys(categoryStats).forEach(category => {
        if (categoryCounts[category] > 0) {
          categoryStats[category] = categoryStats[category] / categoryCounts[category] / 100;
        } else {
          categoryStats[category] = Math.random() * 0.3 + 0.2; // Default small value for empty categories
        }
      });

      return Object.values(categoryStats);
    };

    // Animation variables
    let time = 0;
    const userPerformance = getUserStats();
    const bars = [
      { height: userPerformance[0] || 0.5, targetHeight: userPerformance[0] || 0.5, color: '#8B5CF6', label: 'General' },
      { height: userPerformance[1] || 0.4, targetHeight: userPerformance[1] || 0.4, color: '#06B6D4', label: 'Tech' },
      { height: userPerformance[2] || 0.6, targetHeight: userPerformance[2] || 0.6, color: '#10B981', label: 'Movies' },
      { height: userPerformance[3] || 0.3, targetHeight: userPerformance[3] || 0.3, color: '#F59E0B', label: 'Quotes' },
      { height: userPerformance[4] || 0.4, targetHeight: userPerformance[4] || 0.4, color: '#EF4444', label: 'Visual' },
    ];

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw 3D-like bars
      const barWidth = width / (bars.length * 2);
      const maxBarHeight = height * 0.6;
      
      bars.forEach((bar, index) => {
        const x = (index + 0.5) * barWidth * 1.5;
        const barHeight = bar.height * maxBarHeight;
        const y = height - barHeight - 60;
        
        // Animate height smoothly
        bar.height += (bar.targetHeight - bar.height) * 0.05;
        
        // Draw 3D effect - shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(x + 5, y + 5, barWidth, barHeight);
        
        // Draw main bar
        const barGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        barGradient.addColorStop(0, bar.color);
        barGradient.addColorStop(1, bar.color + '80');
        ctx.fillStyle = barGradient;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw top face (3D effect)
        ctx.fillStyle = bar.color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y - 10);
        ctx.lineTo(x + barWidth + 10, y - 10);
        ctx.lineTo(x + barWidth, y);
        ctx.closePath();
        ctx.fill();
        
        // Draw side face (3D effect)
        ctx.fillStyle = bar.color + '60';
        ctx.beginPath();
        ctx.moveTo(x + barWidth, y);
        ctx.lineTo(x + barWidth + 10, y - 10);
        ctx.lineTo(x + barWidth + 10, y + barHeight - 10);
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.closePath();
        ctx.fill();
        
        // Add category labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(bar.label, x + barWidth / 2, height - 20);
        
        // Add percentage labels
        const percentage = Math.round(bar.height * 100);
        ctx.fillStyle = bar.color;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`${percentage}%`, x + barWidth / 2, y - 15);
        
        // Add floating particles
        const particleX = x + barWidth / 2 + Math.sin(time + index) * 20;
        const particleY = y - 20 + Math.cos(time + index * 2) * 10;
        
        ctx.fillStyle = bar.color + '80';
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connecting lines (data flow effect)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      bars.forEach((bar, index) => {
        const x = (index + 0.5) * barWidth * 1.5 + barWidth / 2;
        const y = height - bar.height * maxBarHeight - 60;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Add pulsing effect
      time += 0.02;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-64 relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute top-4 left-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Performance Analytics
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
        Category-wise performance data
      </div>
    </div>
  );
};

export default Analytics3D;