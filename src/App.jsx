import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnitPage from './pages/UnitPage';
import NotFound from './pages/NotFound';
import QuizEngine from './components/QuizEngine';
import manifest from './content/manifest.json';
import { useState, useEffect } from 'react';

function App() {
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    const loadAllQuestions = async () => {
      const questions = [];
      for (const unit of manifest.units) {
        try {
          const data = await import(`./content/units/${unit.id}.json`);
          questions.push(...data.default.quiz.map(q => ({ ...q, unitId: unit.id })));
        } catch (error) {
          console.error(`Failed to load questions for ${unit.id}`, error);
        }
      }
      setAllQuestions(questions);
    };
    loadAllQuestions();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unit/:id" element={<UnitPage />} />
          <Route
            path="/quiz/all"
            element={
              allQuestions.length > 0 ? (
                <div className="container mx-auto px-4 py-8 max-w-2xl">
                  <QuizEngine
                    questions={allQuestions}
                    unitColor="#ffffff"
                    unitId="all"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-screen">
                  <p className="text-muted">読み込み中...</p>
                </div>
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
