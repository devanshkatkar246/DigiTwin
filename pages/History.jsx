import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function History() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(db, "users", user.uid, "simulations");
      const q = query(ref, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    };

    loadHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Simulation History</h1>

      {records.length === 0 && (
        <p className="text-gray-500 text-center">No records yet. Run a simulation first.</p>
      )}

      <div className="space-y-4">
        {records.map((item) => (
          <div key={item.id} className="p-5 rounded-xl border bg-white shadow-sm">
            <div className="flex justify-between">
              <p className="font-bold text-lg">Score: {item.score}</p>
              <p className="text-gray-500 text-sm">
                {item.createdAt?.toDate()?.toLocaleString() || "pending..."}
              </p>
            </div>

            <p className="text-sm mt-2">
              Study: {item.metrics.studyHours}h |  
              Sleep: {item.metrics.sleepHours}h |  
              Attendance: {item.metrics.attendance}% |  
              Stress: {item.metrics.stressLevel} |  
              Screen: {item.metrics.screenTime}h
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
