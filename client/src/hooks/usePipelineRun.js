// Real-time Firestore subscription for pipeline runs + agent results.
// Pattern matches existing onSnapshot usage in Radio.jsx, Characters.jsx.

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { doc, collection, onSnapshot } from 'firebase/firestore';

export function usePipelineRun(runId) {
  const [run, setRun] = useState(null);
  const [agentResults, setAgentResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!runId || !db) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    // Subscribe to run document
    const runUnsub = onSnapshot(
      doc(db, 'pipelineRuns', runId),
      (snap) => {
        if (snap.exists()) {
          setRun({ id: snap.id, ...snap.data() });
        } else {
          setError('Run not found');
        }
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );

    // Subscribe to agent results subcollection
    const resultsUnsub = onSnapshot(
      collection(db, 'pipelineRuns', runId, 'agentResults'),
      (snap) => {
        const results = {};
        snap.docs.forEach(d => { results[d.id] = d.data(); });
        setAgentResults(results);
      },
      () => {} // silently ignore results errors
    );

    return () => { runUnsub(); resultsUnsub(); };
  }, [runId]);

  return { run, agentResults, loading, error };
}
