import React from 'react';
import { AssessmentRequest } from '../types';

interface WellVisualizerProps {
  inputs: AssessmentRequest;
}

export default function WellVisualizer({ inputs }: WellVisualizerProps) {
  const depth = parseFloat(inputs.depth) || 3500;
  const temp = parseFloat(inputs.knownTemp) || 150;
  const gradient = parseFloat(inputs.geoGradient) || 35;
  const nano = parseFloat(inputs.nanofluidConcentration) || 0.5;
  const trough = parseFloat(inputs.troughEfficiency) || 75;
  const integrity = parseFloat(inputs.integrity) || 8.5;

  // Compute thermal indicators
  const heatIntensity = Math.min(1, Math.max(0.1, temp / 250));
  const gradientIntensity = Math.min(1, Math.max(0.1, gradient / 50));

  // Determine rock representation style
  const getRockStyle = () => {
    switch (inputs.formationRock?.toLowerCase()) {
      case 'basalt':
        return {
          bg: 'fill-slate-800',
          pattern: (
            <pattern id="basalt-pat" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10h20M10 0v20" stroke="#334155" strokeWidth="1" />
              <path d="M5 5l10 10M15 5L5 15" stroke="#1e293b" strokeWidth="1" opacity="0.3" />
            </pattern>
          )
        };
      case 'granite':
        return {
          bg: 'fill-slate-700',
          pattern: (
            <pattern id="granite-pat" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 0l30 30M30 0L0 30" stroke="#475569" strokeWidth="1" />
              <circle cx="15" cy="15" r="2" fill="#0f172a" />
            </pattern>
          )
        };
      case 'limestone':
        return {
          bg: 'fill-stone-800',
          pattern: (
            <pattern id="limestone-pat" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 0h40M0 10h40M0 20h40" stroke="#44403c" strokeWidth="1.5" />
              <path d="M10 0v10M30 0v10M20 10v10M0 10v10" stroke="#292524" strokeWidth="1" />
            </pattern>
          )
        };
      case 'sandstone':
      default:
        return {
          bg: 'fill-amber-950',
          pattern: (
            <pattern id="sandstone-pat" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.5" fill="#78350f" opacity="0.5" />
              <circle cx="12" cy="12" r="1" fill="#451a03" opacity="0.4" />
              <circle cx="12" cy="4" r="1" fill="#78350f" opacity="0.3" />
              <circle cx="4" cy="12" r="1.5" fill="#451a03" opacity="0.6" />
            </pattern>
          )
        };
    }
  };

  const { pattern } = getRockStyle();

  // Nanofluid color representation (MWCNT loading darkens the dynamic convective fluid loop)
  // Higher nano matches deeper blue-emerald graphite slurry
  const fluidColorIn = `hsl(${(180 + nano * 40).toFixed(0)}, 85%, ${(30 - nano * 10).toFixed(0)}%)`;
  const fluidColorOut = `hsl(${(10 + heatIntensity * 20).toFixed(0)}, 95%, ${(50 + nano * 5).toFixed(0)}%)`;

  return (
    <div id="well-visualizer" className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6 flex flex-col items-center relative z-10">
      <div className="w-full flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Geological Cross-Section</span>
          <span className="text-sm font-bold text-slate-200">Dynamic Wellbore Simulation</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></span>
          <span>Fluid Loop Active</span>
        </div>
      </div>

      <div className="relative w-full max-w-sm h-[420px] bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-inner">
        <svg viewBox="0 0 320 400" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {pattern}
            {/* Ambient heat gradient */}
            <linearGradient id="heatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#ef4444" stopOpacity={(0.1 + gradientIntensity * 0.25).toFixed(2)} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={(0.3 + heatIntensity * 0.6).toFixed(2)} />
            </linearGradient>

            {/* Parabolic reflector mirror gloss */}
            <linearGradient id="mirrorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* BACKGROUND ROCK STRATA */}
          <rect x="0" y="80" width="320" height="320" fill="url(#heatGrad)" />
          
          {/* Selective pattern overlay based on rock formation type */}
          <rect x="0" y="110" width="320" height="290" fill={`url(#${inputs.formationRock || 'sandstone'}-pat)`} opacity="0.4" />

          {/* Stratum lines */}
          <line x1="0" y1="110" x2="320" y2="110" stroke="#334155" strokeWidth="2" strokeDasharray="3 4" />
          <line x1="0" y1="180" x2="320" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
          <line x1="0" y1="280" x2="320" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />

          {/* Geological labels */}
          <text x="15" y="100" fill="#94a3b8" fontSize="10" className="font-sans font-bold uppercase tracking-wider" opacity="0.6">Surface Clay Layer</text>
          <text x="15" y="130" fill="#94a3b8" fontSize="10" className="font-sans font-bold uppercase tracking-wider" opacity="0.8">
            {inputs.formationRock ? `${inputs.formationRock} Formation` : 'Sandstone Reservoir'}
          </text>
          <text x="15" y="385" fill="#f87171" fontSize="10" className="font-sans font-bold uppercase tracking-wider" opacity="1">
            Bottom Hole Temp: {temp}°C
          </text>

          {/* SURFACE INSTALLATIONS (Parabolic Solar Collector Panel) */}
          {/* Trough curved outline */}
          <path d="M 60 40 Q 60 75 120 75 Q 180 75 180 40" fill="none" stroke="url(#mirrorGrad)" strokeWidth="8" strokeLinecap="round" />
          <line x1="120" y1="75" x2="120" y2="80" stroke="#475569" strokeWidth="3" />
          
          {/* Sun energy focus rays */}
          <line x1="70" y1="15" x2="90" y2="55" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 3" className="animate-pulse" />
          <line x1="170" y1="15" x2="150" y2="55" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 3" className="animate-pulse" />
          <text x="190" y="52" fill="#fbbf24" fontSize="10" className="font-mono font-bold">
            {trough}% Trough
          </text>

          {/* WELLBORE OUTER STEEL CASING */}
          {/* Scale tube sizing to match actual diameter (e.g. 8" vs 12") */}
          <rect x="135" y="80" width="50" height="290" fill="#1e293b" rx="2" stroke="#475569" strokeWidth="1.5" />
          
          {/* Casing outer threads showing structurally sound bands */}
          <line x1="135" y1="120" x2="185" y2="120" stroke={integrity > 6 ? '#22c55e' : '#f97316'} strokeWidth="1" opacity="0.6" />
          <line x1="135" y1="200" x2="185" y2="200" stroke={integrity > 6 ? '#22c55e' : '#f97316'} strokeWidth="1" opacity="0.6" />
          <line x1="135" y1="280" x2="185" y2="280" stroke={integrity > 6 ? '#22c55e' : '#f97316'} strokeWidth="1" opacity="0.6" />

          {/* INTERNAL DOWNHOLE COAXIAL PIPELINE FLOWS */}
          {/* Down-flow (annulus - cold fluid side) */}
          <path d="M 115 50 L 140 50 L 140 350 L 145 350" fill="none" stroke={fluidColorIn} strokeWidth="6" strokeLinecap="round" />
          {/* Direction indicator arrows descending */}
          <polygon points="140,120 137,112 143,112" fill="#22d3ee" />
          <polygon points="140,220 137,212 143,212" fill="#22d3ee" />

          {/* Up-flow (inner central tube - hot fluid side) */}
          <path d="M 160 350 L 160 80 Q 160 40 215 40" fill="none" stroke={fluidColorOut} strokeWidth="7" strokeLinecap="round" />
          {/* Direction indicator arrows ascending */}
          <polygon points="160,150 157,158 163,158" fill="#ef4444" />
          <polygon points="160,260 157,268 163,268" fill="#ef4444" />

          {/* Return superheated heat exchangers loop */}
          {/* Heat exchanger coil in physical solar collector */}
          <circle cx="120" cy="50" r="10" fill="none" stroke="#f97316" strokeWidth="2.5" className="animate-spin-slow" strokeDasharray="8 6" />

          {/* Dynamic Depth indicator marker */}
          <line x1="110" y1="360" x2="128" y2="360" stroke="#f1f5f9" strokeWidth="2" />
          <line x1="192" y1="360" x2="210" y2="360" stroke="#f1f5f9" strokeWidth="2" />
          <text x="215" y="364" fill="#f1f5f9" fontSize="10" className="font-mono font-bold">
            {depth}m
          </text>

          {/* Fluid Nanofluid descriptor tag */}
          <rect x="25" y="240" width="85" height="28" fill="#020617" rx="4" stroke="#1e293b" />
          <text x="32" y="252" fill="#f1f5f9" fontSize="8" className="font-mono uppercase font-bold">Carbon Slurry</text>
          <text x="32" y="263" fill="#38bdf8" fontSize="8" className="font-mono font-bold">{nano}% Vol loading</text>
        </svg>

        {/* Dynamic Watermark label */}
        <div className="absolute top-3 left-3 flex flex-col bg-[#020408]/80 p-2 rounded-lg border border-white/5 backdrop-blur-sm z-20">
          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Hydraulic Loop Setup</span>
          <span className="text-[10px] font-display font-semibold text-white capitalize leading-none">
            {inputs.wellType === 'coaxial' 
              ? 'Coaxial Annular' 
              : inputs.wellType === 'u-tube' 
                ? 'U-Tube Closed Loop' 
                : 'Doublet Open Wellbore'}
          </span>
        </div>
      </div>

      <div className="w-full mt-4 bg-black/20 rounded-2xl p-4 border border-white/5 text-xs text-slate-400 space-y-2">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 pb-1 border-b border-white/5">
          <span>Simulation Indicators</span>
          <span>Attributes</span>
        </div>
        <div className="flex justify-between">
          <span>Outer Tubing Diameter:</span>
          <span className="font-mono text-slate-200">{inputs.diameter} in</span>
        </div>
        <div className="flex justify-between">
          <span>Well Integrity Safety Index:</span>
          <span className="font-mono text-slate-200">{inputs.integrity}/10</span>
        </div>
        <div className="flex justify-between">
          <span>Subterranean Geopressure:</span>
          <span className="font-mono text-slate-200">{(depth * 0.098).toFixed(1)} MPa</span>
        </div>
      </div>
    </div>
  );
}
