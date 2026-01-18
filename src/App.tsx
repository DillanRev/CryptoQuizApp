import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizQuestion } from './components/QuizQuestion';
import { PracticalExercise } from './components/PracticalExercise';
import { FeedbackPanel } from './components/FeedbackPanel';
import { ProgressTracker } from './components/ProgressTracker';
import { CompletionScreen } from './components/CompletionScreen';
import { Button } from './components/ui/button';
import { Loader2, Home, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { projectId, publicAnonKey } from './utils/supabase/info';

type AppState = 'welcome' | 'dashboard' | 'quiz' | 'feedback' | 'completed';
type QuizMode = 'theory' | 'caesar' | 'vigenere' | 'affine' | 'multiplicative';

interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: number;
}

interface Exercise {
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
}

interface Progress {
  score: number;
  total: number;
  difficulty: number;
  percentage: number;
  answeredCount: number;
  totalAvailable: number;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [studentId] = useState(() => {
    let id = localStorage.getItem('studentId');
    if (!id) {
      id = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('studentId', id);
    }
    return id;
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);

  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explanation?: string;
    hint?: string;
  } | null>(null);

  const [progress, setProgress] = useState<Progress>({
    score: 0,
    total: 0,
    difficulty: 1,
    percentage: 0,
    answeredCount: 0,
    totalAvailable: 11
  });

  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-81daa907`;

  const isPracticalMode = quizMode && ['caesar', 'vigenere', 'affine', 'multiplicative'].includes(quizMode);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard-stats/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardStats(data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    if (appState === 'dashboard') {
      fetchDashboardStats();
    }
  }, [appState]);

  const fetchNextQuestion = async (modeOverride?: QuizMode) => {
    const mode = modeOverride || quizMode;
    setIsLoading(true);
    try {
      const endpoint = mode === 'theory'
        ? '/get-theory-question'
        : '/get-question';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          studentId,
          currentDifficulty: progress.difficulty
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.completed) {
          setAppState('completed');
          toast.success(data.message);
        } else {
          setCurrentQuestion(data.question);
          setSelectedAnswer(null);
          setAttemptNumber(1);
          setProgress(prev => ({
            ...prev,
            totalAvailable: data.totalQuestions,
            answeredCount: data.answeredCount
          }));
        }
      } else {
        toast.error('Failed to load question');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      toast.error('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextExercise = async (modeOverride?: QuizMode) => {
    const mode = modeOverride || quizMode;
    if (!mode) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/get-practical-exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          studentId,
          cipherType: mode,
          currentDifficulty: progress.difficulty
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.completed) {
          setAppState('completed');
          toast.success(data.message);
        } else {
          setCurrentExercise(data.exercise);
          setUserAnswer('');
          setAttemptNumber(1);
          setProgress(prev => ({
            ...prev,
            totalAvailable: data.totalExercises,
            answeredCount: data.answeredCount
          }));
        }
      } else {
        toast.error('Failed to load exercise');
      }
    } catch (error) {
      console.error('Error fetching exercise:', error);
      toast.error('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFromWelcome = () => {
    setAppState('dashboard');
  };

  const handleSelectQuiz = (quizType: string) => {
    const mode = quizType as QuizMode;
    setQuizMode(mode);
    setAppState('quiz');
    setProgress({
      score: 0,
      total: 0,
      difficulty: 1,
      percentage: 0,
      answeredCount: 0,
      totalAvailable: 11
    });

    // Fetch first question/exercise
    if (mode === 'theory') {
      fetchNextQuestion(mode);
    } else {
      fetchNextExercise(mode);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    setIsSubmitting(true);
    try {
      const endpoint = quizMode === 'theory'
        ? '/submit-theory-answer'
        : '/submit-answer';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          studentId,
          questionId: currentQuestion?.id,
          selectedAnswer,
          attemptNumber
        })
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({
          isCorrect: data.isCorrect,
          explanation: data.explanation,
          hint: data.hint
        });

        setProgress({
          score: data.progress.score,
          total: data.progress.total,
          difficulty: data.progress.difficulty,
          percentage: data.progress.percentage,
          answeredCount: progress.answeredCount + (data.isCorrect ? 1 : 0),
          totalAvailable: progress.totalAvailable
        });

        setAppState('feedback');
      } else {
        toast.error('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPracticalAnswer = async () => {
    if (!userAnswer.trim() || !quizMode) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/submit-practical-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          studentId,
          cipherType: quizMode,
          exerciseId: currentExercise?.id,
          answer: userAnswer,
          attemptNumber
        })
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({
          isCorrect: data.isCorrect,
          explanation: data.explanation,
          hint: data.hint
        });

        setProgress({
          score: data.progress.score,
          total: data.progress.total,
          difficulty: data.progress.difficulty,
          percentage: data.progress.percentage,
          answeredCount: progress.answeredCount + (data.isCorrect ? 1 : 0),
          totalAvailable: progress.totalAvailable
        });

        setAppState('feedback');
      } else {
        toast.error('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAppState('quiz');

    if (isPracticalMode) {
      fetchNextExercise();
    } else {
      fetchNextQuestion();
    }
  };

  const handleTryAgain = () => {
    setAttemptNumber(prev => prev + 1);
    setSelectedAnswer(null);
    setUserAnswer('');
    setFeedback(null);
    setAppState('quiz');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    setQuizMode(null);
    setCurrentQuestion(null);
    setCurrentExercise(null);
    setFeedback(null);
    fetchDashboardStats();
  };

  const handleRestart = () => {
    setAppState('dashboard');
    setQuizMode(null);
    setCurrentQuestion(null);
    setCurrentExercise(null);
    setFeedback(null);
    setProgress({
      score: 0,
      total: 0,
      difficulty: 1,
      percentage: 0,
      answeredCount: 0,
      totalAvailable: 11
    });
    fetchDashboardStats();
    toast.success('Ready for a new quiz!');
  };

  const getQuizTitle = () => {
    const titles: Record<string, string> = {
      theory: 'Theory & Knowledge Quiz',
      caesar: 'Caesar Cipher Practice',
      vigenere: 'Vigenère Cipher Practice',
      affine: 'Affine Cipher Practice',
      multiplicative: 'Multiplicative Cipher Practice'
    };
    return quizMode ? titles[quizMode] : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🔐</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {appState === 'welcome' ? 'Crypto Quiz' : getQuizTitle() || 'Crypto Quiz'}
            </h1>
          </div>

          {appState !== 'welcome' && appState !== 'dashboard' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          )}

          {appState === 'dashboard' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppState('welcome')}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {appState === 'welcome' && (
          <WelcomeScreen onStart={handleStartFromWelcome} />
        )}

        {appState === 'dashboard' && (
          <Dashboard onSelectQuiz={handleSelectQuiz} stats={dashboardStats} />
        )}

        {(appState === 'quiz' || appState === 'feedback') && quizMode && (
          <div className="space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker
              score={progress.score}
              total={progress.total}
              percentage={progress.percentage}
              difficulty={progress.difficulty}
              answeredCount={progress.answeredCount}
              totalAvailable={progress.totalAvailable}
            />

            {/* Question/Exercise or Loading */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : appState === 'quiz' ? (
              isPracticalMode && currentExercise ? (
                <PracticalExercise
                  exercise={currentExercise}
                  userAnswer={userAnswer}
                  onAnswerChange={setUserAnswer}
                  onSubmit={handleSubmitPracticalAnswer}
                  isSubmitting={isSubmitting}
                  exerciseNumber={progress.answeredCount + 1}
                  totalExercises={progress.totalAvailable}
                  cipherType={quizMode}
                />
              ) : currentQuestion ? (
                <QuizQuestion
                  question={currentQuestion}
                  selectedAnswer={selectedAnswer}
                  onSelectAnswer={setSelectedAnswer}
                  onSubmit={handleSubmitAnswer}
                  isSubmitting={isSubmitting}
                  questionNumber={progress.answeredCount + 1}
                  totalQuestions={progress.totalAvailable}
                />
              ) : null
            ) : null}

            {/* Feedback */}
            {appState === 'feedback' && feedback && (
              <FeedbackPanel
                isCorrect={feedback.isCorrect}
                explanation={feedback.explanation}
                hint={feedback.hint}
                onNext={handleNext}
                onTryAgain={handleTryAgain}
                showTryAgain={attemptNumber === 1 && !feedback.isCorrect}
              />
            )}
          </div>
        )}

        {appState === 'completed' && (
          <CompletionScreen
            score={progress.score}
            total={progress.total}
            percentage={progress.percentage}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Master cryptography through AI-powered interactive learning •
            Theory, Caesar, Vigenère, Affine & Multiplicative Ciphers
          </p>
        </div>
      </footer>
    </div>
  );
}
