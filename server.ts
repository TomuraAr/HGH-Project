import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for performance scoring
  app.post('/api/score', (req: express.Request, res: express.Response) => {
    try {
      const {
        location = 'Port Harcourt Basin',
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
      } = req.body || {};

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

      return res.json({
        overallScore,
        verdict,
        subScores: { thermalScore, integrityScore, solarScore, deploymentScore },
        metrics: { estSurfaceTemp, estPowerOutput: estPowerOutput.toFixed(2), paybackPeriod },
        strengths,
        risks,
        materialNotes
      });
    } catch (error) {
      console.error("Evaluation failure:", error);
      return res.status(400).json({ error: "System processing failure or syntax syntax mismatch." });
    }
  });

  // Serve Vite in dev mode, Static Assets in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
