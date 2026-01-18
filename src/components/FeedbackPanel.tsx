import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight } from 'lucide-react';

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation?: string;
  hint?: string;
  onNext: () => void;
  onTryAgain: () => void;
  showTryAgain: boolean;
}

export function FeedbackPanel({
  isCorrect,
  explanation,
  hint,
  onNext,
  onTryAgain,
  showTryAgain
}: FeedbackPanelProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isCorrect ? (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-900 text-lg font-semibold">
            Correct! Well done! 🎉
          </AlertTitle>
          {explanation && (
            <AlertDescription className="text-green-800 mt-2">
              {explanation}
            </AlertDescription>
          )}
        </Alert>
      ) : (
        <Alert className="border-orange-500 bg-orange-50">
          <XCircle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-900 text-lg font-semibold">
            Not quite right
          </AlertTitle>
          {hint && (
            <AlertDescription className="text-orange-800 mt-2">
              <div className="flex items-start gap-2 mt-3 p-3 bg-white rounded-lg border border-orange-200">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-900 mb-1">AI Tutor says:</p>
                  <p className="text-gray-700">{hint}</p>
                </div>
              </div>
            </AlertDescription>
          )}
        </Alert>
      )}

      <div className="flex gap-3">
        {!isCorrect && showTryAgain && (
          <Button
            onClick={onTryAgain}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Try Again
          </Button>
        )}
        <Button
          onClick={onNext}
          className="flex-1"
          size="lg"
        >
          {isCorrect ? 'Next Question' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
