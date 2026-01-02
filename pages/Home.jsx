import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center max-w-4xl mx-auto">
      
      <div className="mb-8 p-4 bg-indigo-50 rounded-full animate-pulse">
        <i className="fas fa-user-graduate text-5xl text-indigo-600"></i>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Your Academic <span className="text-indigo-600">Digital Twin</span>
      </h1>

      <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
        Predict your academic performance using our advanced modeling engine. 
        Input your daily habits and see your potential growth over the next 30 days.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-indigo-600 text-2xl mb-3">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Predict Trends</h3>
          <p className="text-sm text-slate-500">See where your habits lead over 7 & 30 days.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-purple-600 text-2xl mb-3">
            <i className="fas fa-brain"></i>
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Smart Insights</h3>
          <p className="text-sm text-slate-500">Get suggestions to optimize productivity.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-teal-600 text-2xl mb-3">
            <i className="fas fa-history"></i>
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Track Progress</h3>
          <p className="text-sm text-slate-500">Save assessments & track improvement.</p>
        </div>

      </div>

      <Link
        to="/input"
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
      >
        Create Your DigiTwin
        <i className="fas fa-arrow-right ml-3 transition-transform group-hover:translate-x-1"></i>
      </Link>

    </div>
  );
};

export default Home;
