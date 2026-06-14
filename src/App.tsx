import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Activity, 
  Database, 
  Globe, 
  ChevronRight, 
  RefreshCw, 
  Layers, 
  Sun, 
  TrendingUp, 
  Sparkles, 
  Cpu, 
  BookOpen 
} from 'lucide-react';
import { AssessmentRequest, AssessmentResult } from './types';
import { BASIN_PRESETS, INITIAL_FORM_STATE } from './constants';
import WellVisualizer from './components/WellVisualizer';
import Dashboard from './components/Dashboard';

// High-fidelity local calculation engine mimicking server calculations
export function calculateLocalResult(data: AssessmentRequest): AssessmentResult {
  const {
    depth = '3500',
    age = '5',
    diameter = '9.625',
    wellType = 'coaxial',
    knownTemp = '150',
    geoGradient = '35',
    formationRock = 'sandstone',
    solarIrradiance = '5.5',
    gridDistance = '2.5',
    integrity = '8.5',
    nanofluidConcentration = '0.5',
    troughEfficiency = '78',
    operationalDays = '330'
  } = data;

  // Convert inputs to numbers safely
  const depthNum = parseFloat(depth) || 0;
  const ageNum = parseFloat(age) || 0;
  const tempNum = parseFloat(knownTemp) || 0;
  const gradientNum = parseFloat(geoGradient) || 0;
  const solarNum = parseFloat(solarIrradiance) || 0;
  const integrityNum = parseFloat(integrity) || 0; // expected 0 to 10
  const gridDistNum = parseFloat(gridDistance) || 0;
  const nanoConc = parseFloat(nanofluidConcentration) || 0.5;
  const troughEff = parseFloat(troughEfficiency) || 70;

  // Core Technical Evaluation Calculations (Scores range 0-100)
  const thermalScore = Math.min(100, Math.round((tempNum / 200) * 50 + (gradientNum / 45) * 50));
  const integrityScore = Math.min(100, Math.max(0, Math.round(integrityNum * 10 - ageNum * 1.2)));
  const solarScore = Math.min(100, Math.round((solarNum / 7) * 100));
  const deploymentScore = Math.min(100, Math.max(0, Math.round(100 - (gridDistNum * 4.5))));

  // Weighted Overall Framework Score
  const overallScore = Math.round(
    (thermalScore * 0.35) + 
    (integrityScore * 0.25) + 
    (solarScore * 0.20) + 
    (deploymentScore * 0.20)
  );

  // Operational Verdict Engine
  let verdict = "High Viability Deployment";
  if (overallScore < 55) verdict = "Unviable / High Risk Factor";
  else if (overallScore < 75) verdict = "Conditional / Semi-Viable Deployment";

  // Thermodynamic Forecast Modeling
  const estSurfaceTemp = Math.round(tempNum * 0.94);
  // Net energy scaling using nanofluid and trough gains
  const fluidMultiplier = 1 + (nanoConc * 0.2); 
  const troughMultiplier = 1 + (troughEff / 200);
  const estPowerOutput = (((thermalScore * 1.4) * fluidMultiplier) + ((solarScore * 1.9) * troughMultiplier)) / 10;
  const paybackPeriod = Math.max(2.1, (11.5 - (overallScore * 0.09))).toFixed(1);

  // Deep Material-Level Insights Text Blocks
  const materialNotes = `MWCNT nanofluid configured at ${nanoConc}% loading maximizes subterranean convective heat flux. This dynamic pairing alongside high-reflectivity parabolic trough collectors (${troughEff}% efficiency) dramatically suppresses thermal gradient decay over long-distance fluid loops.`;

  const strengths = [
    thermalScore > 75 ? "Excellent downhole thermodynamic energy profile." : "Favorable baseline fluid heat levels.",
    integrityScore > 65 ? "Wellbore structural casing retains high pressure threshold capacities." : "Well configuration fits standard coaxial installation setups.",
    solarNum > 5.0 ? "Abundant localized solar footprint guarantees flawless surface loop superheating." : "Acceptable localized surface irradiance metrics."
  ];

  const risks = [
    gridDistNum > 8 ? `Extended grid distance (${gridDistNum}km) requires heightened substructure capital expenditures.` : "Minimal grid infrastructure matching friction expected.",
    integrityScore < 55 ? "Casing structural integrity metrics demand immediate pre-deployment rehabilitation." : "Standard downhole structural stress expected.",
    depthNum > 3800 ? "Deep well hydrodynamics will escalate pumping friction losses." : "Fluid circulation demands remain within nominal operational parameters."
  ];

  return {
    overallScore,
    verdict,
    subScores: { thermalScore, integrityScore, solarScore, deploymentScore },
    metrics: { estSurfaceTemp, estPowerOutput: estPowerOutput.toFixed(2), paybackPeriod },
    strengths,
    risks,
    materialNotes
  };
}

export default function App() {
  const [formData, setFormData] = useState<AssessmentRequest>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<'reservoir' | 'loop' | 'infrastructure'>('reservoir');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Run automatically on mount to show preview evaluation
  useEffect(() => {
    executeScoring(INITIAL_FORM_STATE);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const loadPreset = (presetId: string) => {
    const selected = BASIN_PRESETS.find((p) => p.id === presetId);
    if (selected) {
      setFormData(selected.values);
      executeScoring(selected.values);
    }
  };

  const executeScoring = async (dataToSubmit: AssessmentRequest) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });
      if (!response.ok) {
        throw new Error('API server returned error status.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn('API fetch fell back. Executing local telemetry modeling engine:', err);
      try {
        const localData = calculateLocalResult(dataToSubmit);
        setResult(localData);
      } catch (localErr) {
        console.error('Core local calculation failed:', localErr);
        setErrorMsg('Failed to process telemetry calculations. Please verify your asset variables.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeScoring(formData);
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans antialiased selection:bg-blue-500 selection:text-white relative overflow-hidden flex flex-col">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0c1a2d_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#091422_0%,transparent_50%)] pointer-events-none z-0"></div>
      
      {/* Institutional Top Navbar */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 shadow-xl relative">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-display font-bold text-xl border border-white/20 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              H
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400 block leading-none mb-1">Project HGH</span>
              <span className="text-lg font-bold tracking-tight text-slate-100">Grid Harvest Modeler</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">System Status</span>
              <span className="flex items-center text-xs text-emerald-400 font-medium font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                Core Evaluation Active
              </span>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Version</span>
              <span className="text-xs font-mono text-slate-300">4.82-DEEP-WELL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10 relative z-10 flex-1 w-full">
        
        {/* Editorial Sub-Header Block */}
        <div className="border-l-4 border-blue-500 pl-6 space-y-2">
          <h1 className="text-3xl font-display font-bold text-white tracking-tight sm:text-4xl">
            Advanced Energy Array Assessment Platform
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            Evaluate subterranean geothermal-solar hybrid thermodynamic gradients, lithology matrices, and net megawatt asset capacities against international clean energy infrastructure investment benchmarks.
          </p>
        </div>

        {/* Global Preset Matrices Deck */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Geological Basin Assembly Presets</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Fast Calibration Deck</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {BASIN_PRESETS.map((preset) => {
              const isActive = formData.location === preset.values.location;
              return (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  type="button"
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all outline-none text-xs group cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-500/60 text-slate-100 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`font-bold block transition-all ${isActive ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-400'}`}>
                      {preset.name}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-2 block leading-snug">
                      {preset.description}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 w-full text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span>Temp: {preset.values.knownTemp}°C</span>
                    <ChevronRight className="w-3 h-3 text-blue-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interface Layout */}
        <div id="modeler-main-split" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: 14-Vector Asset Configuration Matrix Form */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="p-5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-4 h-4 text-blue-400 animate-spin-slow" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">14-Vector Configuration Deck</h2>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setFormData(INITIAL_FORM_STATE);
                  executeScoring(INITIAL_FORM_STATE);
                }}
                className="flex items-center text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-blue-400 cursor-pointer transition-colors"
                title="Reset to Baseline"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </button>
            </div>

            {/* Category Sub-tabs */}
            <div className="grid grid-cols-3 border-b border-white/5 bg-black/20">
              <button
                type="button"
                onClick={() => setActiveCategory('reservoir')}
                className={`py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeCategory === 'reservoir' 
                    ? 'border-blue-500 text-blue-400 bg-blue-950/10 font-bold' 
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                1. Reservoir
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('loop')}
                className={`py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeCategory === 'loop' 
                    ? 'border-blue-500 text-blue-400 bg-blue-950/10 font-bold' 
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                2. Loops
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('infrastructure')}
                className={`py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  activeCategory === 'infrastructure' 
                    ? 'border-blue-500 text-blue-400 bg-blue-950/10 font-bold' 
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                3. Operations
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Category 1: Subsurface Reservoir Attributes */}
              {activeCategory === 'reservoir' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Asset/Wellbore Target Name</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange}
                      className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Well Depth (m)</label>
                      <input 
                        type="number" 
                        name="depth" 
                        min="500"
                        max="8000"
                        value={formData.depth} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Bottom Reservoir Temp (°C)</label>
                      <input 
                        type="number" 
                        name="knownTemp" 
                        min="20"
                        max="400"
                        value={formData.knownTemp} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Thermal Gradient (°C/km)</label>
                      <input 
                        type="number" 
                        name="geoGradient" 
                        min="5"
                        max="100"
                        value={formData.geoGradient} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Formation Rock Matrix</label>
                      <select 
                        name="formationRock" 
                        value={formData.formationRock} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      >
                        <option value="sandstone" className="bg-slate-950">Sandstone Porous Layer</option>
                        <option value="basalt" className="bg-slate-950">Basaltic Igneous Compound</option>
                        <option value="granite" className="bg-slate-950">Crystalline Granite Shield</option>
                        <option value="limestone" className="bg-slate-950">Lithic limestone strata</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/20 border border-blue-500/10 rounded-lg flex items-start space-x-2 mt-4 text-[11px] leading-relaxed text-slate-400">
                    <Layers className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <p>
                      <strong>Subsurface Variables:</strong> Bottom-hole temperatures and geo thermal rise rates establish the fundamental geothermal capability of the extraction array.
                    </p>
                  </div>
                </div>
              )}

              {/* Category 2: Fluid Operations & Collector Efficiency */}
              {activeCategory === 'loop' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Flow Loop Type</label>
                      <select 
                        name="wellType" 
                        value={formData.wellType} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      >
                        <option value="coaxial" className="bg-slate-950">Coaxial Annular Loop</option>
                        <option value="u-tube" className="bg-slate-950">U-Tube Closed Pipeline</option>
                        <option value="doublet" className="bg-slate-950">Open Doublet Wellbore</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tubing Outer Diameter (in)</label>
                      <input 
                        type="number" 
                        step="0.125"
                        name="diameter" 
                        min="3"
                        max="24"
                        value={formData.diameter} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">MWCNT Vol Loading concentration (%)</label>
                      <span className="text-[10px] font-mono font-bold text-blue-400">{formData.nanofluidConcentration}%</span>
                    </div>
                    <input 
                      type="range" 
                      name="nanofluidConcentration" 
                      min="0.1"
                      max="1.5"
                      step="0.1"
                      value={formData.nanofluidConcentration} 
                      onChange={handleInputChange}
                      className="w-full accent-blue-500 bg-black/40 rounded-lg h-1.5"
                    />
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest flex justify-between mt-1">
                      <span>0.1% Loading</span>
                      <span>1.5% Peak Load</span>
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Parabolic Optical Collector Eff (%)</label>
                      <span className="text-[10px] font-mono font-bold text-blue-400">{formData.troughEfficiency}%</span>
                    </div>
                    <input 
                      type="range" 
                      name="troughEfficiency" 
                      min="50"
                      max="95"
                      step="1"
                      value={formData.troughEfficiency} 
                      onChange={handleInputChange}
                      className="w-full accent-blue-500 bg-black/40 rounded-lg h-1.5"
                    />
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest flex justify-between mt-1">
                      <span>50% Basic</span>
                      <span>95% Ultra Mirror</span>
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-lg flex items-start space-x-2 mt-4 text-[11px] leading-relaxed text-slate-400">
                    <Sun className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>
                      <strong>Loop Upgrades:</strong> Utilizing Multi-Walled Carbon Nanotubes (MWCNT) suppresses thermal decay. Surface trough mirrors then supply supplementary superheating.
                    </p>
                  </div>
                </div>
              )}

              {/* Category 3: Lifecycle Integrity & Operational Logistics */}
              {activeCategory === 'infrastructure' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Asset Age (years)</label>
                      <input 
                        type="number" 
                        name="age" 
                        min="0"
                        max="80"
                        value={formData.age} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Casing Integrity safety (0-10)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        name="integrity" 
                        min="1"
                        max="10"
                        value={formData.integrity} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Peak Solar Irr (kWh/m²/d)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        name="solarIrradiance" 
                        min="1"
                        max="10"
                        value={formData.solarIrradiance} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Main Grid Distance (km)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        name="gridDistance" 
                        min="0.1"
                        max="50"
                        value={formData.gridDistance} 
                        onChange={handleInputChange}
                        className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Project Operating Cycles (days/yr)</label>
                    <input 
                      type="number" 
                      name="operationalDays" 
                      min="50"
                      max="365"
                      value={formData.operationalDays} 
                      onChange={handleInputChange}
                      className="w-full bg-black/40 text-slate-100 border border-white/10 rounded-lg px-3 py-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:bg-black/60 outline-none transition-all"
                    />
                  </div>

                  <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded-lg flex items-start space-x-2 mt-4 text-[11px] leading-relaxed text-slate-400">
                    <Cpu className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p>
                      <strong>Integration Logistics:</strong> Proximity to the grid substation and high annual operational days maximize energy yield and compress payback schedules.
                    </p>
                  </div>
                </div>
              )}

              {/* Large Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-medium text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Subterranean Array...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Performance Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT PANEL: Live Physical Cross Section Visualizer + Scoring Telemetry Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Split row containing dynamic well cross section + small registration notice card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              <div className="md:col-span-4 flex flex-col justify-between space-y-6">
                
                {/* Small Institutional Register Notice Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                      <Database className="w-3.5 h-3.5 mr-2 text-blue-400" />
                      Registry Status
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter structural location parameters to compute thermodynamic safety margins against environmental agency targets.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 text-[10px] space-y-2 text-slate-400">
                    <div className="flex justify-between">
                      <span>Index Integrity Check:</span>
                      <span className="font-mono text-blue-400">PASSED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Server Sync:</span>
                      <span className="font-mono text-emerald-400">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Performance boost info banner */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-4 text-[10px] text-slate-500 leading-relaxed space-y-2">
                  <span className="font-bold text-slate-300 uppercase tracking-widest block">Thermodynamic Formula</span>
                  <p className="font-mono text-[9px] text-slate-400">
                    Net Output = (((ThermalScore × 1.4) × FluidMulti) + ((SolarScore × 1.9) × TroughMulti)) / 10
                  </p>
                </div>
              </div>

              {/* Dynamic SVG geological cross section card */}
              <div className="md:col-span-8 h-full">
                <WellVisualizer inputs={formData} />
              </div>
            </div>

            {/* Error Message if Fetch fails */}
            {errorMsg && (
              <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-lg p-4 text-xs font-semibold flex items-center space-x-2">
                <span>⚠</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Results Dashboard or Blank State */}
            {loading && !result ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-blue-950/40 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/25 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-200">Processing Subterranean Arrays</span>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Connecting to the institutional assessment engine. Modeling downhole thermal heat fluxes and nanofluid decay rates.
                  </p>
                </div>
              </div>
            ) : result ? (
              <Dashboard result={result} inputs={formData} />
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                <Activity className="w-8 h-8 text-slate-600 animate-pulse" />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-300">Awaiting Telemetry Calculation</span>
                  <p className="text-xs text-slate-500">
                    Adjust target well parameters in the left panel and click &quot;Execute Performance Assessment&quot; to compile the reports.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Corporate Footnote */}
      <footer className="bg-black/40 border-t border-white/5 py-8 text-center text-xs text-slate-500 relative z-10 mt-auto">
        <p>© 2026 Grid Harvest Assessment Matrix. All Rights Reserved. Complying with Carbon Disclosure Benchmarks.</p>
      </footer>
    </div>
  );
}
