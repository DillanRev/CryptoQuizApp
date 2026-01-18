import React from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Trophy, Target, TrendingUp, Star } from 'lucide-react';

interface ProgressTrackerProps {
  score: number;
  total: number;
  percentage: number;
  difficulty: number;
  answeredCount: number;
  totalAvailable: number;
}

export function ProgressTracker({
  score,
  total,
  percentage,
  difficulty,
  answeredCount,
  totalAvailable
}: ProgressTrackerProps) {
  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < difficulty);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Score</p>
              <p className="text-lg font-bold text-gray-900">{score}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Accuracy</p>
              <p className="text-lg font-bold text-gray-900">{percentage}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Progress</p>
              <p className="text-lg font-bold text-gray-900">
                {answeredCount}/{totalAvailable}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Level</p>
              <div className="flex gap-0.5">
                {difficultyStars.map((filled, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      filled ? 'fill-purple-600 text-purple-600' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">
              {answeredCount} of {totalAvailable} questions completed
            </span>
          </div>
          <Progress value={(answeredCount / totalAvailable) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
