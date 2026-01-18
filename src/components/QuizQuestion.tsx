import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface QuizQuestionProps {
  question: {
    id: number;
    question: string;
    options: string[];
    difficulty: number;
  };
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  isSubmitting,
  questionNumber,
  totalQuestions
}: QuizQuestionProps) {
  const difficultyColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800'
  };

  const difficultyLabels = {
    1: 'Beginner',
    2: 'Beginner',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardDescription>
            Question {questionNumber} of {totalQuestions}
          </CardDescription>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
            {difficultyLabels[question.difficulty as keyof typeof difficultyLabels]}
          </span>
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onSelectAnswer(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50 ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
              onClick={() => onSelectAnswer(index)}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={onSubmit}
          disabled={selectedAnswer === null || isSubmitting}
          className="w-full mt-6"
          size="lg"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </Button>
      </CardContent>
    </Card>
  );
}
