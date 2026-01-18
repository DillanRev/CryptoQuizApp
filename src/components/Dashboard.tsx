import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, Code, Lock, Key, Calculator, Binary, CheckCircle2, Trophy } from 'lucide-react';

interface DashboardProps {
  onSelectQuiz: (quizType: string) => void;
  stats: {
    theoryProgress: any;
    cipherStats: Record<string, any>;
    totalTheoryQuestions: number;
    totalCaesarExercises: number;
    totalVigenereExercises: number;
    totalAffineExercises: number;
    totalMultiplicativeExercises: number;
  } | null;
}

export function Dashboard({ onSelectQuiz, stats }: DashboardProps) {
  const quizCards = [
    {
      id: 'theory',
      title: 'Theory & Knowledge',
      description: 'Learn fundamental cryptography concepts and terminology',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      total: stats?.totalTheoryQuestions || 15,
      progress: stats?.theoryProgress
    },
    {
      id: 'caesar',
      title: 'Caesar Cipher',
      description: 'Practice shift-based encryption used by Julius Caesar',
      icon: Key,
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      total: stats?.totalCaesarExercises || 5,
      progress: stats?.cipherStats?.caesar
    },
    {
      id: 'vigenere',
      title: 'Vigenère Cipher',
      description: 'Master polyalphabetic substitution with keywords',
      icon: Lock,
      color: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      total: stats?.totalVigenereExercises || 3,
      progress: stats?.cipherStats?.vigenere
    },
    {
      id: 'affine',
      title: 'Affine Cipher',
      description: 'Apply mathematical transformations (ax + b) mod 26',
      icon: Calculator,
      color: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      total: stats?.totalAffineExercises || 3,
      progress: stats?.cipherStats?.affine
    },
    {
      id: 'multiplicative',
      title: 'Multiplicative Cipher',
      description: 'Encrypt using modular multiplication',
      icon: Binary,
      color: 'from-teal-500 to-cyan-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      total: stats?.totalMultiplicativeExercises || 2,
      progress: stats?.cipherStats?.multiplicative
    }
  ];

  const getProgressPercentage = (progress: any) => {
    if (!progress || progress.totalQuestions === 0) return 0;
    return Math.round((progress.correctAnswers / progress.totalQuestions) * 100);
  };

  const getCompletedCount = (progress: any) => {
    return progress?.correctAnswers || 0;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mb-4">
          <Code className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Cryptography Learning Center</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose a quiz type to start learning. Master cryptography concepts through theory and hands-on cipher practice!
        </p>
      </div>

      {/* Quiz Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {quizCards.map((quiz) => {
          const Icon = quiz.icon;
          const percentage = getProgressPercentage(quiz.progress);
          const completed = getCompletedCount(quiz.progress);
          const hasStarted = quiz.progress && quiz.progress.totalQuestions > 0;

          return (
            <Card
              key={quiz.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-300"
              onClick={() => onSelectQuiz(quiz.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${quiz.iconBg}`}>
                    <Icon className={`h-6 w-6 ${quiz.iconColor}`} />
                  </div>
                  {hasStarted && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">In Progress</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasStarted ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">
                        {completed} / {quiz.total} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${quiz.color} transition-all duration-500`}
                        style={{ width: `${(completed / quiz.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {percentage}% accuracy
                        </span>
                      </div>
                      <Button size="sm" className="group-hover:scale-105 transition-transform">
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {quiz.total} {quiz.id === 'theory' ? 'questions' : 'exercises'} available
                    </p>
                    <Button className={`w-full bg-gradient-to-r ${quiz.color} hover:opacity-90`}>
                      Start Learning
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Path Suggestion */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <BookOpen className="h-5 w-5" />
            Recommended Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
              <div className="font-semibold text-sm mb-1">1. Theory</div>
              <div className="text-xs text-gray-600">Learn basics</div>
            </div>
            <div className="hidden md:flex items-center justify-center text-amber-400">→</div>
            <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
              <div className="font-semibold text-sm mb-1">2. Caesar</div>
              <div className="text-xs text-gray-600">Simple shifts</div>
            </div>
            <div className="hidden md:flex items-center justify-center text-amber-400">→</div>
            <div className="text-center p-3 bg-white rounded-lg border border-amber-200">
              <div className="font-semibold text-sm mb-1">3. Advanced</div>
              <div className="text-xs text-gray-600">Complex ciphers</div>
            </div>
          </div>
          <p className="text-sm text-amber-800 mt-4">
            💡 Start with Theory & Knowledge to build a strong foundation, then practice with Caesar cipher before moving to advanced mathematical ciphers!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
