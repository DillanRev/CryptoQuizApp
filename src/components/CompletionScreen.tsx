import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Star, Target, RotateCcw } from 'lucide-react';

interface CompletionScreenProps {
  score: number;
  total: number;
  percentage: number;
  onRestart: () => void;
}

export function CompletionScreen({ score, total, percentage, onRestart }: CompletionScreenProps) {
  const getMessage = () => {
    if (percentage >= 90) return {
      title: "Outstanding! 🏆",
      message: "You're a cryptography expert! Excellent work!",
      color: "from-yellow-400 to-orange-500"
    };
    if (percentage >= 75) return {
      title: "Great Job! 🌟",
      message: "You have a strong understanding of cryptography!",
      color: "from-blue-400 to-indigo-500"
    };
    if (percentage >= 60) return {
      title: "Good Work! 👍",
      message: "You're making great progress in learning cryptography!",
      color: "from-green-400 to-emerald-500"
    };
    return {
      title: "Keep Learning! 📚",
      message: "You're on the right path! Try again to improve your score.",
      color: "from-purple-400 to-pink-500"
    };
  };

  const result = getMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className={`bg-gradient-to-br ${result.color} text-white border-0`}>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Trophy className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl mb-2">{result.title}</CardTitle>
          <CardDescription className="text-white text-lg opacity-90">
            {result.message}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{score}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-center mb-4">What's Next?</h3>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm text-gray-700 mb-4">
                  🎯 Review the questions you found challenging and try to understand the concepts better. Cryptography is all about practice and repetition!
                </p>
                <Button onClick={onRestart} className="w-full" size="lg">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start New Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
