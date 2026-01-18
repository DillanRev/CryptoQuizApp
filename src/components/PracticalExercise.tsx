import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Code } from 'lucide-react';

interface PracticalExerciseProps {
  exercise: {
    id: number;
    question: string;
    type: string;
    difficulty: number;
    plaintext?: string;
    ciphertext?: string;
    shift?: number;
    keyword?: string;
    a?: number;
    b?: number;
    multiplier?: number;
  };
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  exerciseNumber: number;
  totalExercises: number;
  cipherType: string;
}

export function PracticalExercise({
  exercise,
  userAnswer,
  onAnswerChange,
  onSubmit,
  isSubmitting,
  exerciseNumber,
  totalExercises,
  cipherType
}: PracticalExerciseProps) {
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

  const cipherNames: Record<string, string> = {
    caesar: 'Caesar Cipher',
    vigenere: 'Vigenère Cipher',
    affine: 'Affine Cipher',
    multiplicative: 'Multiplicative Cipher'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardDescription>
            Exercise {exerciseNumber} of {totalExercises}
          </CardDescription>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}`}>
            {difficultyLabels[exercise.difficulty as keyof typeof difficultyLabels]}
          </span>
        </div>
        <CardTitle className="text-xl flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600" />
          {cipherNames[cipherType]}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {exercise.question}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exercise Details */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          {exercise.plaintext && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Plaintext:</Label>
              <div className="mt-1 p-2 bg-white rounded border border-gray-200 font-mono">
                {exercise.plaintext}
              </div>
            </div>
          )}
          
          {exercise.ciphertext && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Ciphertext:</Label>
              <div className="mt-1 p-2 bg-white rounded border border-gray-200 font-mono">
                {exercise.ciphertext}
              </div>
            </div>
          )}

          {exercise.shift !== undefined && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Shift Value:</Label>
              <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-200 font-mono text-blue-900">
                {exercise.shift}
              </div>
            </div>
          )}

          {exercise.keyword && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Keyword:</Label>
              <div className="mt-1 p-2 bg-purple-50 rounded border border-purple-200 font-mono text-purple-900">
                {exercise.keyword}
              </div>
            </div>
          )}

          {exercise.a !== undefined && exercise.b !== undefined && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Formula:</Label>
              <div className="mt-1 p-2 bg-orange-50 rounded border border-orange-200 font-mono text-orange-900">
                E(x) = ({exercise.a}x + {exercise.b}) mod 26
              </div>
            </div>
          )}

          {exercise.multiplier !== undefined && (
            <div>
              <Label className="text-sm font-semibold text-gray-700">Multiplier:</Label>
              <div className="mt-1 p-2 bg-teal-50 rounded border border-teal-200 font-mono text-teal-900">
                {exercise.multiplier}
              </div>
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="space-y-2">
          <Label htmlFor="answer" className="text-base font-semibold">
            Your Answer:
          </Label>
          <Input
            id="answer"
            type="text"
            value={userAnswer}
            onChange={(e) => onAnswerChange(e.target.value.toUpperCase())}
            placeholder={exercise.type === 'findKey' ? "Enter number" : "Enter your answer (letters only)"}
            className="font-mono text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && userAnswer.trim()) {
                onSubmit();
              }
            }}
          />
          <p className="text-xs text-gray-500">
            {exercise.type === 'findKey' 
              ? 'Enter the numeric key value'
              : 'Enter letters only (A-Z). Spaces and punctuation will be ignored.'
            }
          </p>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!userAnswer.trim() || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </Button>

        {/* Helper Tip */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> {cipherType === 'caesar' && 'Remember that each letter shifts by the same amount. A→D means shift by 3!'}
            {cipherType === 'vigenere' && 'The keyword repeats for each letter. Each position uses a different shift!'}
            {cipherType === 'affine' && 'Apply the formula to the position of each letter (A=0, B=1, ..., Z=25).'}
            {cipherType === 'multiplicative' && 'Multiply the letter position by the key, then take mod 26.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
