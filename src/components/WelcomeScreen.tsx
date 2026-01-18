import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trophy, BookOpen, Brain } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl mb-2">Cryptography Quiz Game</CardTitle>
          <CardDescription className="text-blue-100 text-lg">
            Learn cryptography concepts through AI-powered interactive quizzes
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Answer Questions</h3>
              <p className="text-gray-600">
                Choose the best answer from multiple choices on cryptography topics
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Get AI Hints</h3>
              <p className="text-gray-600">
                If you get stuck, our AI tutor provides helpful hints and explanations
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Adaptive Difficulty</h3>
              <p className="text-gray-600">
                Questions adjust to your skill level - learn at your own pace!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your score and watch your cryptography skills improve
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-lg">Ready to Learn?</h3>
          </div>
          <p className="text-gray-700 mb-6">
            Start your journey to understanding cryptography! The quiz will begin with easier questions and gradually adapt to your skill level.
          </p>
          <Button onClick={onStart} size="lg" className="w-full" >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
