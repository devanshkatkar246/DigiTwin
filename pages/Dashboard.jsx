import React, { useEffect, useState, useMemo,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScoreChart from "../components/ScoreChart";
import { simulatePerformance } from "../api";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";





const Dashboard = () => {
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) navigate("/login");
    });
  }, []);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
    return () => unsubscribe();
  }, []);
  
  const [baseData, setBaseData] = useState(null);
  const [simMetrics, setSimMetrics] = useState(null);
  const [aiAdvice, setAIAdvice] = useState("");
  const reportRef = useRef();
  

useEffect(() => {
  const lastSim = localStorage.getItem("last_simulation");
  if (!lastSim) {
    navigate("/input");
    return;
  }
  const parsed = JSON.parse(lastSim);
  setBaseData(parsed);
  setSimMetrics(parsed.metrics);
}, [navigate]); 
// 🚀 Generate AI advice when data loads
// useEffect(() => {
//   if (!baseData) return;
  
//   const fetchAI = async () => {
//     const advice = await generateAIAdvice(baseData.metrics);
//     setAIAdvice(advice);
//   };
  
//   fetchAI();
// }, [baseData]);
const simulatedResult = useMemo(() => {
  if (!simMetrics) return null;
  return simulatePerformance(simMetrics);
}, [simMetrics]);
// useEffect(() => {
//   if (!baseData || !simMetrics) return;

//   const fetchComparison = async () => {
//     const result = await compareHabitsAI(baseData.metrics, simMetrics);
//     setAIComparison(result);
//   };

//   fetchComparison();
// }, [simMetrics]);

if (!baseData || !simulatedResult) {
  return (
    <div className="flex justify-center items-center h-64 text-slate-500">
      Loading Dashboard...
    </div>
  );
}

const handleSimChange = (e) => {
  const { name, value } = e.target;
  setSimMetrics((prev) =>
    prev
  ? {
    ...prev,
    [name]: name === "revisionFrequency" ? value : Number(value),
          }
          : null
        );
      };
      
      const scoreDiff = parseFloat((simulatedResult.score - baseData.score).toFixed(2));
      const isPositive = scoreDiff >= 0;
      
      const getSuggestions = (result) => {
        const { metrics } = result;
        const items = [];
        
        if (metrics.sleepHours < 6)
          items.push({ text: "Increase sleep to 7-8 hours for better cognitive productivity.", type: "warning" });
        
        if (metrics.stressLevel > 3)
          items.push({
        text: "High stress detected. Reduce workload or practice mindfulness to prevent burnout.",
        type: "warning",
      });
      
      if (metrics.screenTime > 5)
        items.push({
      text: "Excessive screen usage. Reduce digital distraction for better focus.",
      type: "info",
    });
    
    if (metrics.revisionFrequency === "Weekly")
      items.push({ text: "Switch to daily revision to improve retention.", type: "success" });
    
    if (metrics.studyHours < 2)
      items.push({
    text: "Increase study duration slightly for meaningful improvement.",
    type: "info",
  });
  
  
  return items;
};  
const suggestions = getSuggestions(baseData);

const getHabitImpact = (metrics) => {
  const impacts = [];

  if (metrics.studyHours >= 6) {
    impacts.push({ habit: "Study Hours", level: "High Impact", color: "emerald" });
  } else if (metrics.studyHours >= 3) {
    impacts.push({ habit: "Study Hours", level: "Medium Impact", color: "yellow" });
  } else {
    impacts.push({ habit: "Study Hours", level: "Low Impact", color: "rose" });
  }

  if (metrics.sleepHours >= 7) {
    impacts.push({ habit: "Sleep", level: "Low Risk", color: "emerald" });
  } else {
    impacts.push({ habit: "Sleep", level: "High Risk", color: "rose" });
  }

  if (metrics.stressLevel >= 4) {
    impacts.push({ habit: "Stress", level: "High Risk", color: "rose" });
  } else {
    impacts.push({ habit: "Stress", level: "Low Risk", color: "emerald" });
  }

  if (metrics.screenTime > 5) {
    impacts.push({ habit: "Screen Time", level: "High Risk", color: "rose" });
  } else {
    impacts.push({ habit: "Screen Time", level: "Controlled", color: "emerald" });
  }
  return impacts;
};
const habitScores = (metrics) => [
  { label: "Study", value: metrics.studyHours * 10 },
  { label: "Sleep", value: metrics.sleepHours * 10 },
  { label: "Attendance", value: metrics.attendance },
  { label: "Stress", value: 100 - metrics.stressLevel * 20 },
  { label: "Screen Time", value: 100 - metrics.screenTime * 10 }
];

const generatePDF = async () => {
  const element = reportRef.current;
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("Digital_Twin_Report.pdf");
};


    return (
      <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Digital Twin Dashboard</h1>
          <p className="text-slate-500">Live behavior modeling & academic forecasting</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setSimMetrics(baseData.metrics)}
            className="px-4 py-2 text-sm bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
            >
            Reset Simulation
          </button>

          <Link
            to="/input"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-lg"
            >
            <i className="fas fa-edit text-sm"></i> New DigiTwin
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Base Score */}
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative">
              <span className="text-indigo-100 text-xs uppercase font-bold">Baseline Score</span>
              <div className="text-5xl font-black mt-1">{baseData.score}</div>
              <div className="mt-4 text-xs bg-indigo-500 bg-opacity-30 p-2 rounded-lg inline-block">
                Verified Assessment
              </div>
              <i className="fas fa-check-circle absolute -right-4 -bottom-4 text-8xl text-white opacity-10"></i>
            </div>

            {/* Simulated Score */}
            <div
              className={`rounded-3xl p-6 text-white shadow-xl relative overflow-hidden ${
                isPositive ? "bg-purple-600" : "bg-rose-600"
              }`}
              >
              <span className="text-purple-100 text-xs uppercase font-bold">Simulated Score</span>
              <div className="text-5xl font-black mt-1">{simulatedResult.score}</div>

              <div className="mt-4 flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    isPositive ? "bg-emerald-500" : "bg-rose-500"
                  } bg-opacity-30`}
                  >
                  {isPositive ? "+" : ""}
                  {scoreDiff} {isPositive ? "Points" : "Risk"}
                </div>
                <span className="text-xs opacity-80 italic">What-If projection</span>
              </div>

              <i className="fas fa-magic absolute -right-4 -bottom-4 text-8xl text-white opacity-10"></i>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-chart-line text-indigo-500"></i> Performance Trajectory
              </h3>

              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div> Actual
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-purple-500 border border-white"></div> Simulated
                </div>
              </div>
            </div>

            <div className="h-80">
              <ScoreChart
                current={{
                  score: baseData.score,
                  future7: baseData.future7,
                  future30: baseData.future30,
                }}
                simulated={{
                  score: simulatedResult.score,
                  future7: simulatedResult.future7,
                  future30: simulatedResult.future30,
                }}
              />
            </div>
          </div>

          {/* What-If Simulation Slider Panel */}
          <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fas fa-sliders-h text-indigo-600"></i> What-If habits change?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/** Sliders */}
              {[
                ["studyHours", "STUDY HOURS"],
                ["sleepHours", "SLEEP HOURS"],
                ["stressLevel", "STRESS LEVEL"],
                ["screenTime", "SCREEN TIME"],
              ].map(([field, label]) => (
                <div key={field} className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-slate-600">
                    <span>{label}</span>
                    <span className="text-indigo-600">
                      {simMetrics[field]}
                      {field.includes("Hours") ? "h" : ""}
                    </span>
                  </div>
                  <input
                    type="range"
                    name={field}
                    min={field === "stressLevel" ? "1" : "0"}
                    max={field === "stressLevel" ? "5" : "10"}
                    step="0.5"
                    value={simMetrics[field]}
                    onChange={handleSimChange}
                    className="w-full accent-indigo-600"
                  />
                </div>
              ))}

              </div>
              {/* Revision toggle */}
              <div className="md:col-span-2 pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-bold">REVISION</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {["Weekly", "Daily"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setSimMetrics((p) =>
                            p ? { ...p, revisionFrequency: type } : null
                          )
                        }
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg ${
                          simMetrics.revisionFrequency === type
                            ? "bg-white shadow text-indigo-600"
                            : "text-slate-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* What-if outcome */}
            <div
              className={`mt-10 p-4 rounded-2xl flex gap-4 ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${
                  isPositive ? "bg-emerald-500" : "bg-rose-500"
                } text-white`}
              >
                <i className={`fas ${isPositive ? "fa-arrow-trend-up" : "fa-triangle-exclamation"}`}></i>
              </div>

              <div>
                <p className="font-bold text-lg">
                  {isPositive
                    ? `Potential Gain: +${scoreDiff} points`
                    : `Risk: -${Math.abs(scoreDiff)} score drop`}
                </p>
                <p className="text-sm opacity-80">
                  {isPositive
                    ? "Good improvements detected — maintain habits for growth."
                    : "Warning: habits may negatively impact performance."}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
  <h3 className="text-xl font-bold text-white">AI Insights</h3>
            
          </div>
        </div>
        

        {/* Sidebar: Suggestions */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-6">
              <i className="fas fa-lightbulb text-amber-400 mr-2"></i> Baseline Insights
            </h3>

            <div className="space-y-3">
  {aiAdvice
    ? aiAdvice.split("\n").map((line, i) => (
        <div
          key={i}
          className="p-3 rounded-xl bg-white/10 border border-white/20 text-sm text-slate-200"
        >
          {line.replace("•", "").trim()}
        </div>
      ))
    : <p className="text-slate-400">Generating AI insights...</p>
  }
</div>
    </div>
<div className="bg-white rounded-2xl p-6 shadow-sm border">
  <h3 className="text-lg font-bold mb-4">Habit Impact Breakdown</h3>

  <div className="space-y-3">
    {getHabitImpact(baseData.metrics).map((item, i) => (
      <div
        key={i}
        className={`flex justify-between items-center p-3 rounded-xl bg-${item.color}-50`}
      >
        <span className="font-semibold">{item.habit}</span>
        <span className={`text-${item.color}-600 font-bold text-sm`}>
          {item.level}
        </span>
      </div>
    ))}
  </div>
</div>
<div className="bg-white rounded-2xl p-6 shadow-sm border">
  <h3 className="text-lg font-bold mb-4">Daily Habit Score</h3>

  <div className="space-y-4">
    {habitScores(baseData.metrics).map((h, i) => (
      <div key={i}>
        <div className="flex justify-between text-sm font-medium mb-1">
          <span>{h.label}</span>
          <span>{Math.min(h.value, 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(h.value, 100)}%` }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
          {/* Metrics summary */}
          <div className="bg-white p-8 rounded-[2rem] border shadow">
            <h3 className="text-lg font-bold mb-4">
              <i className="fas fa-clipboard-list text-indigo-500 mr-2"></i>
              Profile Metrics
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Study:</span><b>{baseData.metrics.studyHours}h/day</b></div>
              <div className="flex justify-between"><span>Sleep:</span><b>{baseData.metrics.sleepHours}h/night</b></div>
              <div className="flex justify-between"><span>Attendance:</span><b>{baseData.metrics.attendance}%</b></div>
              <div className="flex justify-between"><span>Revision:</span><b>{baseData.metrics.revisionFrequency}</b></div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Dashboard;
