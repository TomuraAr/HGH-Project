import React, { useState } from 'react';
import { AssessmentResult, AssessmentRequest } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Thermometer, 
  Calendar, 
  Clock, 
  HelpCircle, 
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';

interface DashboardProps {
  result: AssessmentResult;
  inputs: AssessmentRequest;
}

export default function Dashboard({ result, inputs }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'thermo' | 'risks'>('overview');

  const { overallScore, verdict, subScores, metrics, strengths, risks, materialNotes } = result;
  const { thermalScore, integrityScore, solarScore, deploymentScore } = subScores;

  // Verdict coloring
  const getVerdictStyle = (v: string) => {
    if (v.toLowerCase().includes('high viability') || overallScore >= 75) {
      return {
        bg: 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300 backdrop-blur-md',
        dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
        badge: 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400',
        text: 'text-emerald-400'
      };
    } else if (v.toLowerCase().includes('conditional') || (overallScore >= 55 && overallScore < 75)) {
      return {
        bg: 'bg-amber-950/20 border-amber-500/20 text-amber-300 backdrop-blur-md',
        dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
        badge: 'bg-amber-950/40 border border-amber-500/30 text-amber-500',
        text: 'text-amber-500'
      };
    } else {
      return {
        bg: 'bg-rose-950/20 border-rose-500/20 text-rose-300 backdrop-blur-md',
        dot: 'bg-rose-500 shadow-[0_0_8px_#ef4444]',
        badge: 'bg-rose-950/40 border border-rose-500/30 text-rose-400',
        text: 'text-rose-400'
      };
    }
  };

  const style = getVerdictStyle(verdict);

  // Radar chart coordinates calculations
  // Center is (105, 105), max radius is 75
  const getRadarPoint = (score: number, angleDegrees: number) => {
    const r = (score / 100) * 75;
    const rad = (angleDegrees - 90) * (Math.PI / 180);
    const x = 105 + r * Math.cos(rad);
    const y = 105 + r * Math.sin(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  // 4 corners of the radar at 0, 90, 180, 270 degrees
  const pThermal = getRadarPoint(thermalScore, 0);
  const pIntegrity = getRadarPoint(integrityScore, 90);
  const pSolar = getRadarPoint(solarScore, 180);
  const pDeployment = getRadarPoint(deploymentScore, 270);
  const polygonPoints = `${pThermal} ${pIntegrity} ${pSolar} ${pDeployment}`;

  // Full poly coordinates at 100% capacity
  const fullThermal = getRadarPoint(100, 0);
  const fullIntegrity = getRadarPoint(100, 90);
  const fullSolar = getRadarPoint(100, 180);
  const fullDeployment = getRadarPoint(100, 270);

  // Halway coordinates at 50% capacity
  const halfThermal = getRadarPoint(50, 0);
  const halfIntegrity = getRadarPoint(50, 90);
  const halfSolar = getRadarPoint(50, 180);
  const halfDeployment = getRadarPoint(50, 270);

  return (
    <div id="evaluation-dashboard" className="space-y-6">
      {/* Upper Tab Selection Menu */}
      <div className="flex border-b border-white/5 bg-black/10 rounded-t-xl overflow-hidden">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex-1 sm:flex-initial px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-400 bg-blue-950/10' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Comprehensive Assessment
        </button>
        <button 
          onClick={() => setActiveTab('thermo')}
          className={`flex-1 sm:flex-initial px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'thermo' 
              ? 'border-blue-500 text-blue-400 bg-blue-950/10' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Thermodynamic Forecasting
        </button>
        <button 
          onClick={() => setActiveTab('risks')}
          className={`flex-1 sm:flex-initial px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'risks' 
              ? 'border-blue-500 text-blue-400 bg-blue-950/10' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Institutional Risk Logs ({risks.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Assessment Header Row */}
          <div className={`rounded-2xl border p-6 ${style.bg} flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
            <div className="space-y-2 text-center md:text-left relative z-10">
              <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${style.badge}`}>
                <span className={`w-2 h-2 ${style.dot} rounded-full mr-2`}></span>
                {verdict}
              </span>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">
                {inputs.location} Feasibility Verdict
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                Overall system framework algorithm completed successfully. Well bore parameters align with {overallScore >= 75 ? 'supreme viability benchmarks for long-term clean recovery.' : overallScore >= 55 ? 'conditional criteria. Pre-deployment lining adjustments are highly advised.' : 'critical hazard standards. Secondary remediation cycles are required.'}
              </p>
            </div>

            {/* Glowing Score Circle Ring */}
            <div className="relative shrink-0 flex items-center justify-center z-10 bg-black/20 p-2.5 rounded-full border border-white/5">
              <svg className="w-24 h-24">
                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                <circle 
                  cx="48" 
                  cy="48" 
                  r="42" 
                  fill="none" 
                  stroke={overallScore >= 75 ? "#10b981" : overallScore >= 55 ? "#f59e0b" : "#ef4444"} 
                  strokeWidth="5" 
                  strokeDasharray="263.8" 
                  strokeDashoffset={(263.8 - (263.8 * overallScore) / 100).toFixed(1)} 
                  strokeLinecap="round" 
                  className={`transition-all duration-1000 ${overallScore >= 75 ? "drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" : overallScore >= 55 ? "drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" : "drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white leading-none font-mono">{overallScore}</span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Index</span>
              </div>
            </div>
          </div>

          {/* Subscores Grid with Interactive Radar Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Vector Evaluation</span>
              <span className="text-base font-bold text-slate-200 mb-4 block">4-Quadrant Structuring</span>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* SVG Radar Polygon Spike Chart */}
                <div className="w-[210px] h-[210px] bg-black/40 rounded-full border border-white/10 flex items-center justify-center p-2 shrink-0">
                  <svg viewBox="0 0 210 210" width="100%" height="100%" className="select-none text-xs font-mono">
                    {/* Ring axis grids */}
                    <circle cx="105" cy="105" r="75" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" strokeDasharray="3 3" />
                    <circle cx="105" cy="105" r="37.5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" strokeDasharray="3 3" />
                    
                    {/* Corner Diagonal lines */}
                    <line x1="105" y1="30" x2="105" y2="180" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="30" y1="105" x2="180" y2="105" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                    {/* Corner polygon text markers */}
                    <text x="105" y="24" fill="#94a3b8" textAnchor="middle" className="font-bold text-[8px] uppercase">Thrm: {thermalScore}%</text>
                    <text x="184" y="108" fill="#94a3b8" textAnchor="start" className="font-bold text-[8px] uppercase">Intg: {integrityScore}%</text>
                    <text x="105" y="194" fill="#94a3b8" textAnchor="middle" className="font-bold text-[8px] uppercase">Sol: {solarScore}%</text>
                    <text x="24" y="108" fill="#94a3b8" textAnchor="end" className="font-bold text-[8px] uppercase">Grid: {deploymentScore}%</text>

                    {/* Full capacity reference outline */}
                    <polygon points={`${fullThermal} ${fullIntegrity} ${fullSolar} ${fullDeployment}`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" opacity="0.3" />
                    {/* 50% capacity outline */}
                    <polygon points={`${halfThermal} ${halfIntegrity} ${halfSolar} ${halfDeployment}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" opacity="0.4" />

                    {/* The Active Filled Radar Area */}
                    <polygon points={polygonPoints} fill="url(#radarAreaFill)" stroke="#2563eb" strokeWidth="2.5" className="drop-shadow-[0_0_6px_rgba(37,99,235,0.4)]" />

                    {/* Define color fill and glows */}
                    <defs>
                      <linearGradient id="radarAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    {/* Corner points dots with active glows */}
                    <circle cx={pThermal.split(',')[0]} cy={pThermal.split(',')[1]} r="4" fill="#3b82f6" />
                    <circle cx={pIntegrity.split(',')[0]} cy={pIntegrity.split(',')[1]} r="4" fill="#10b981" />
                    <circle cx={pSolar.split(',')[0]} cy={pSolar.split(',')[1]} r="4" fill="#fbbf24" />
                    <circle cx={pDeployment.split(',')[0]} cy={pDeployment.split(',')[1]} r="4" fill="#8b5cf6" />
                  </svg>
                </div>

                {/* Subscore metric details */}
                <div className="space-y-4 flex-1 w-full">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>Thermal Array Score</span>
                      <span className="font-mono font-bold text-slate-200">{thermalScore}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${thermalScore}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>Wellbore Structural Score</span>
                      <span className="font-mono font-bold text-slate-200">{integrityScore}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${integrityScore}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2"></span>Surface Irradiance Score</span>
                      <span className="font-mono font-bold text-slate-200">{solarScore}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${solarScore}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>Grid Interconnection Score</span>
                      <span className="font-mono font-bold text-slate-200">{deploymentScore}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${deploymentScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Projected Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-4 justify-between h-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                    <Thermometer className="w-3 h-3 mr-1 text-blue-400" />
                    Projected Surface Temp
                  </span>
                  <span className="text-3xl font-display font-medium text-slate-100">{metrics.estSurfaceTemp}°C</span>
                  <span className="block text-[10px] text-slate-400 mt-1">94% thermal retention from reservoir</span>
                </div>
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-blue-400 border border-white/10">
                  <Thermometer className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-emerald-400" />
                    Est Power Capacity
                  </span>
                  <span className="text-3xl font-display font-medium text-slate-100">{metrics.estPowerOutput} MWe</span>
                  <span className="block text-[10px] text-slate-300 mt-1 flex items-center font-mono">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400 mr-1 shrink-0" />
                    Solar Trough + Nanofluid superheating
                  </span>
                </div>
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-amber-400" />
                    Capital Amortization
                  </span>
                  <span className="text-3xl font-display font-medium text-slate-100">{metrics.paybackPeriod} Yrs</span>
                  <span className="block text-[10px] text-slate-400 mt-1">Calculated via baseline infrastructure index</span>
                </div>
                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-amber-400 border border-white/10">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Immediate Actions Block */}
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Structural Evaluation Indicators</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold block">Favorable Strengths</span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {strengths.map((str, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-500 mr-2 text-sm leading-none">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-amber-400 text-[10px] uppercase tracking-wider font-bold block">Operational Vulnerabilities</span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {risks.map((risk, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-500 mr-2 text-sm leading-none font-bold">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Deep Material-Level Analysis block */}
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Thermodynamic Materials Dispatch</span>
            </div>
            <p className="text-xs font-mono text-slate-300 italic leading-relaxed">
              &quot;{materialNotes}&quot;
            </p>
          </div>
        </div>
      )}

      {activeTab === 'thermo' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Thermodynamic Multiplier & Surface Superheating Forecast</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              When subsurface geothermal waters are circulated through the MWCNT nanofluid loops, convective heat transfer rates are amplified. The water is further superheated at the surface through parabolic collector fields with an optical efficiency of {inputs.troughEfficiency || 78}%.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Bottom Hole Temp</span>
                <span className="text-2xl font-bold font-mono text-blue-400">{inputs.knownTemp}°C</span>
                <span className="block text-[9px] text-slate-500 mt-2">Wellbore source index</span>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nanofluid Gain (MWCNT)</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">+{((parseFloat(inputs.nanofluidConcentration) || 0.5) * 20).toFixed(0)}%</span>
                <span className="block text-[9px] text-slate-500 mt-2">Circulation flux boost</span>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Surface Solar Gain</span>
                <span className="text-2xl font-bold font-mono text-amber-400">+{((parseFloat(inputs.troughEfficiency) || 75) / 2).toFixed(0)}%</span>
                <span className="block text-[9px] text-slate-500 mt-2">Trough superheating potential</span>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cylinder Well Volume</span>
                <span className="text-2xl font-bold font-mono text-purple-400">
                  {((Math.PI * Math.pow((parseFloat(inputs.diameter) || 9.625) / 24, 2) * (parseFloat(inputs.depth) || 3500)).toFixed(0))} m³
                </span>
                <span className="block text-[9px] text-slate-500 mt-2">Calculated piping capacity</span>
              </div>
            </div>

            <div className="mt-6 bg-black/20 p-4 rounded-xl border border-white/5 text-xs text-slate-300 space-y-3">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block flex items-center">
                <Info className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Underground Fluid Mechanics Notice
              </span>
              <p className="leading-relaxed">
                The target well employs a <strong>{inputs.wellType} Coaxial circulation pathway</strong>. Cold thermodynamic water is dispersed uniformly within the annulus before gathering heat through the casing from the surrounding <strong>{inputs.formationRock} porous rock formation</strong>. It ascends the central retrieval tube at velocity, insulated from thermal dissipation.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6">
            <h4 className="text-sm font-bold text-slate-200 mb-2">Institutional Safety & Structural Audit Logs</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Geothermal installation represents deep thermodynamic stress. The following indicators identify potential hazards regarding geological stability, well age, grid distance, and structural depth friction:
            </p>

            <div className="space-y-3">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-slate-200">Wellbore Casing Degradation Vector</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    Well active age of <strong>{inputs.age} years</strong> with an integrity baseline rating of <strong>{inputs.integrity}/10</strong>. 
                    {parseFloat(inputs.integrity) < 5.5 ? ' Alert: Immediate casing rehabilitation or high pressure cementing is required before pressurizing the fluid loop.' : ' Structure remains structurally durable under standard operation stress.'}
                  </span>
                </div>
              </div>

              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-slate-200">Fluid Mechanics & Depth Circulating Friction</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    Subsurface depth of <strong>{inputs.depth} meters</strong> will induce estimated friction pressure drop of <strong>{(parseFloat(inputs.depth) * 0.003).toFixed(1)} bar</strong>. High performance downhole submersible pumps are recommended for consistent loop circulation.
                  </span>
                </div>
              </div>

              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="block font-bold text-xs text-slate-200">Subterranean Rock Lithology Resistance</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    Formation rock type <strong>{inputs.formationRock}</strong> has localized porosity limitations. Heat conduction rate indexes estimated at <strong>{inputs.formationRock === 'basalt' ? '2.8 W/m·K' : inputs.formationRock === 'granite' ? '3.2 W/m·K' : '1.8 W/m·K'}</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
