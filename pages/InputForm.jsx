import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { simulatePerformance } from "../api";
import { auth, db } from "../firebase";
import { saveSimulation } from "../firebase";

const InputForm = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    studyHours: 4,
    sleepHours: 7,
    attendance: 85,
    stressLevel: 3,
    revisionFrequency: "Weekly",
    screenTime: 3,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetrics((prev) => ({
      ...prev,
      [name]: name === "revisionFrequency" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // 1. Calculate score
      const result = simulatePerformance(metrics);

      // 2. Save for dashboard access
      localStorage.setItem("last_simulation", JSON.stringify(result));

      // Save offline history
      const localHistory = JSON.parse(localStorage.getItem("local_history") || "[]");
      localStorage.setItem("local_history", JSON.stringify([result, ...localHistory].slice(0, 20)));

      // 3. Save to Firestore (background)
      await saveSimulation(result);
       localStorage.setItem("last_simulation", JSON.stringify(result));
       navigate("/dashboard");

      // 4. Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Simulation failed:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">HABITS</h2>
      <p className="text-slate-400 mb-10 text-center text-sm font-medium">
        Adjust the sliders to reflect your daily habits.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Study Hours */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
              Study Hours (per day)
            </label>
            <span className="text-indigo-600 font-black text-lg">{metrics.studyHours}h</span>
          </div>
          <input
            type="range"
            name="studyHours"
            min="0"
            max="10"
            step="0.5"
            value={metrics.studyHours}
            onChange={handleChange}
            className="w-full h-2.5 bg-slate-100 rounded-full cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Sleep Hours */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Sleep Hours</label>
            <span className="text-indigo-600 font-black text-lg">{metrics.sleepHours}h</span>
          </div>
          <input
            type="range"
            name="sleepHours"
            min="0"
            max="10"
            step="0.5"
            value={metrics.sleepHours}
            onChange={handleChange}
            className="w-full h-2.5 bg-slate-100 rounded-full cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Attendance */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Attendance %</label>
            <span className="text-indigo-600 font-black text-lg">{metrics.attendance}%</span>
          </div>
          <input
            type="range"
            name="attendance"
            min="0"
            max="100"
            value={metrics.attendance}
            onChange={handleChange}
            className="w-full h-2.5 bg-slate-100 rounded-full cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Stress Level */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Stress Level (1-5)</label>
            <span className="text-indigo-600 font-black text-lg">{metrics.stressLevel}</span>
          </div>
          <input
            type="range"
            name="stressLevel"
            min="1"
            max="5"
            value={metrics.stressLevel}
            onChange={handleChange}
            className="w-full h-2.5 bg-slate-100 rounded-full cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Screen Time */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
              Screen Time (entertainment)
            </label>
            <span className="text-indigo-600 font-black text-lg">{metrics.screenTime}h</span>
          </div>
          <input
            type="range"
            name="screenTime"
            min="0"
            max="10"
            step="0.5"
            value={metrics.screenTime}
            onChange={handleChange}
            className="w-full h-2.5 bg-slate-100 rounded-full cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Revision Frequency */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">
            Revision Frequency
          </label>
          <div className="relative">
            <select
              name="revisionFrequency"
              value={metrics.revisionFrequency}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-100 transition-all"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all disabled:bg-slate-400 flex justify-center items-center gap-3 shadow-xl"
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <><i className="fas fa-rocket"></i> Generate Digital Twin</>}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
