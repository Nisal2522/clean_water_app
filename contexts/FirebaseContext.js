import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.config';
import { 
  saveGameSession, 
  savePlayerScore, 
  getTopScores, 
  getGameStatistics,
  logAnalyticsEvent,
  ANALYTICS_EVENTS 
} from '../services/firebaseService';

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameSession, setGameSession] = useState(null);
  const [topScores, setTopScores] = useState([]);
  const [gameStats, setGameStats] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize game session
  const startGameSession = async (playerName = 'Anonymous') => {
    try {
      const sessionData = {
        playerName,
        startTime: new Date().toISOString(),
        scenarios: [],
        currentScenario: 1,
        score: 0,
        status: 'active'
      };
      
      const sessionId = await saveGameSession(sessionData);
      setGameSession({ id: sessionId, ...sessionData });
      
      // Log analytics
      logAnalyticsEvent(ANALYTICS_EVENTS.GAME_STARTED, {
        player_name: playerName,
        session_id: sessionId
      });
      
      return sessionId;
    } catch (error) {
      console.error('Error starting game session:', error);
      throw error;
    }
  };

  // Complete scenario
  const completeScenario = async (scenarioData) => {
    if (!gameSession) return;
    
    try {
      const updatedSession = {
        ...gameSession,
        scenarios: [...gameSession.scenarios, scenarioData],
        currentScenario: gameSession.currentScenario + 1,
        score: gameSession.score + scenarioData.points || 0
      };
      
      setGameSession(updatedSession);
      
      // Log analytics
      logAnalyticsEvent(ANALYTICS_EVENTS.SCENARIO_COMPLETED, {
        scenario: scenarioData.scenario,
        tool_used: scenarioData.toolUsed,
        time_taken: scenarioData.timeTaken,
        session_id: gameSession.id
      });
      
    } catch (error) {
      console.error('Error completing scenario:', error);
    }
  };

  // Complete game
  const completeGame = async (finalScore) => {
    if (!gameSession) return;
    
    try {
      const gameData = {
        ...gameSession,
        endTime: new Date().toISOString(),
        finalScore,
        status: 'completed'
      };
      
      // Save final game data
      await saveGameSession(gameData);
      
      // Save player score
      await savePlayerScore({
        playerName: gameSession.playerName,
        score: finalScore,
        scenariosCompleted: gameSession.scenarios.length,
        gameDuration: new Date(gameData.endTime) - new Date(gameData.startTime)
      });
      
      // Log analytics
      logAnalyticsEvent(ANALYTICS_EVENTS.GAME_COMPLETED, {
        final_score: finalScore,
        scenarios_completed: gameSession.scenarios.length,
        session_id: gameSession.id
      });
      
      setGameSession(null);
      
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  // Log tool selection
  const logToolSelection = (toolName, isCorrect, scenario) => {
    logAnalyticsEvent(
      isCorrect ? ANALYTICS_EVENTS.TOOL_SELECTED : ANALYTICS_EVENTS.WRONG_TOOL_SELECTED,
      {
        tool_name: toolName,
        is_correct: isCorrect,
        scenario: scenario,
        session_id: gameSession?.id
      }
    );
  };

  // Load top scores
  const loadTopScores = async () => {
    try {
      const scores = await getTopScores(10);
      setTopScores(scores);
    } catch (error) {
      console.error('Error loading top scores:', error);
    }
  };

  // Load game statistics
  const loadGameStatistics = async () => {
    try {
      const stats = await getGameStatistics();
      setGameStats(stats);
    } catch (error) {
      console.error('Error loading game statistics:', error);
    }
  };

  const value = {
    user,
    loading,
    gameSession,
    topScores,
    gameStats,
    startGameSession,
    completeScenario,
    completeGame,
    logToolSelection,
    loadTopScores,
    loadGameStatistics
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
