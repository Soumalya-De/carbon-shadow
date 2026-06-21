import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useCarbonModel } from '../hooks/useCarbonModel';
import { getShadowArchetype } from '../data/moodLibrary';

// Initial state definition
const initialTraces = {
  emails: 40,
  aiPrompts: 15,
  streaming: 3,
  meetings: 12,
  storage: 50,
  social: 2,
};

const initialState = {
  scene: 1,
  traces: { ...initialTraces },
  futureTraces: { ...initialTraces },
  footprint: null,
  futureFootprint: null,
  shadowReading: {
    type: "Digital Shadow",
    typeDescription: "",
    mood: "Calculating...",
    moodColor: "#00f0ff",
    moodBgGlow: "rgba(0,240,255,0.1)",
    primaryContributor: "Data Traffic",
    weight: "Moderate",
    narrative: "Your footprint is being evaluated by the cognitive mirror...",
    futureNarrative: "Awaiting carbon redirection parameters...",
    futureTips: [
      "Aggregate AI requests to reduce active GPU spin-up cycles.",
      "Opt for standard resolution streaming when high-definition is redundant.",
      "Audit cloud backups and discard obsolete storage logs."
    ]
  },
  geminiLoading: false,
  geminiError: null,
  shareModalOpen: false,
  pledges: {},
};

// Reducer Actions
const ACTIONS = {
  SET_SCENE: 'SET_SCENE',
  UPDATE_TRACES: 'UPDATE_TRACES',
  UPDATE_FUTURE_TRACES: 'UPDATE_FUTURE_TRACES',
  SET_FOOTPRINT: 'SET_FOOTPRINT',
  SET_FUTURE_FOOTPRINT: 'SET_FUTURE_FOOTPRINT',
  SET_GEMINI_LOADING: 'SET_GEMINI_LOADING',
  SET_GEMINI_READING: 'SET_GEMINI_READING',
  SET_GEMINI_ERROR: 'SET_GEMINI_ERROR',
  TOGGLE_SHARE_MODAL: 'TOGGLE_SHARE_MODAL',
  RESET: 'RESET',
  UPDATE_PLEDGES: 'UPDATE_PLEDGES'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCENE:
      return { ...state, scene: action.payload };
    case ACTIONS.UPDATE_TRACES: {
      const newTraces = { ...state.traces, ...action.payload };
      return {
        ...state,
        traces: newTraces,
        // Sync futureTraces initially so they match when first entering scene 7/6
        futureTraces: state.scene <= 2 ? { ...newTraces } : state.futureTraces
      };
    }
    case ACTIONS.UPDATE_FUTURE_TRACES:
      return { ...state, futureTraces: { ...state.futureTraces, ...action.payload } };
    case ACTIONS.SET_FOOTPRINT:
      return { ...state, footprint: action.payload };
    case ACTIONS.SET_FUTURE_FOOTPRINT:
      return { ...state, futureFootprint: action.payload };
    case ACTIONS.SET_GEMINI_LOADING:
      return { ...state, geminiLoading: action.payload };
    case ACTIONS.SET_GEMINI_READING:
      return { 
        ...state, 
        shadowReading: { ...state.shadowReading, ...action.payload },
        geminiLoading: false,
        geminiError: null
      };
    case ACTIONS.SET_GEMINI_ERROR:
      return { ...state, geminiError: action.payload, geminiLoading: false };
    case ACTIONS.TOGGLE_SHARE_MODAL:
      return { ...state, shareModalOpen: action.payload };
    case ACTIONS.UPDATE_PLEDGES:
      return { ...state, pledges: { ...state.pledges, ...action.payload } };
    case ACTIONS.RESET:
      return {
        ...initialState,
        traces: { ...initialTraces },
        futureTraces: { ...initialTraces },
        pledges: {}
      };
    default:
      return state;
  }
}

const CarbonShadowContext = createContext(null);

export function CarbonShadowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Callbacks for Worker Calculations
  const handleBaselineComplete = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_FOOTPRINT, payload: data });
  }, []);

  const handleFutureComplete = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_FUTURE_FOOTPRINT, payload: data });
  }, []);

  // Web Workers run in background
  useCarbonModel(state.traces, handleBaselineComplete);
  useCarbonModel(state.futureTraces, handleFutureComplete);

  // Helper properties
  const baselineArchetype = useMemo(() => {
    return state.footprint 
      ? getShadowArchetype(state.footprint.breakdown, state.footprint.totalAnnualKg) 
      : null;
  }, [state.footprint]);

  const futureArchetype = useMemo(() => {
    return state.futureFootprint 
      ? getShadowArchetype(state.futureFootprint.breakdown, state.futureFootprint.totalAnnualKg) 
      : null;
  }, [state.futureFootprint]);

  // Calculate the Alternative Tomorrow Score (0 - 100)
  // Reflects percentage footprint reduction
  let reductionScore = 0;
  if (state.footprint && state.futureFootprint) {
    const baseVal = state.footprint.totalDailyGrams;
    const futureVal = state.futureFootprint.totalDailyGrams;
    if (baseVal > 0) {
      reductionScore = Math.max(0, Math.min(100, Math.round(((baseVal - futureVal) / baseVal) * 100)));
    }
  }

  const setScene = (sceneNum) => dispatch({ type: ACTIONS.SET_SCENE, payload: sceneNum });
  const updateTraces = (updates) => dispatch({ type: ACTIONS.UPDATE_TRACES, payload: updates });
  const updateFutureTraces = (updates) => dispatch({ type: ACTIONS.UPDATE_FUTURE_TRACES, payload: updates });
  const toggleShareModal = (open) => dispatch({ type: ACTIONS.TOGGLE_SHARE_MODAL, payload: open });
  const setGeminiLoading = (loading) => dispatch({ type: ACTIONS.SET_GEMINI_LOADING, payload: loading });
  const setGeminiReading = (reading) => dispatch({ type: ACTIONS.SET_GEMINI_READING, payload: reading });
  const setGeminiError = (err) => dispatch({ type: ACTIONS.SET_GEMINI_ERROR, payload: err });
  const updatePledges = (updates) => dispatch({ type: ACTIONS.UPDATE_PLEDGES, payload: updates });
  const resetApp = () => dispatch({ type: ACTIONS.RESET });

  return (
    <CarbonShadowContext.Provider
      value={{
        ...state,
        baselineArchetype,
        futureArchetype,
        reductionScore,
        setScene,
        updateTraces,
        updateFutureTraces,
        toggleShareModal,
        setGeminiLoading,
        setGeminiReading,
        setGeminiError,
        updatePledges,
        resetApp
      }}
    >
      {children}
    </CarbonShadowContext.Provider>
  );
}

export function useCarbonShadow() {
  const context = useContext(CarbonShadowContext);
  if (!context) {
    throw new Error('useCarbonShadow must be used within a CarbonShadowProvider');
  }
  return context;
}
