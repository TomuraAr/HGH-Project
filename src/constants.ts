import { BasinPreset, AssessmentRequest } from './types';

export const INITIAL_FORM_STATE: AssessmentRequest = {
  location: 'Port Harcourt Basin',
  depth: '3500',
  age: '5',
  diameter: '9.625',
  wellType: 'coaxial',
  knownTemp: '145',
  geoGradient: '35',
  formationRock: 'sandstone',
  solarIrradiance: '5.8',
  gridDistance: '1.2',
  integrity: '8.8',
  nanofluidConcentration: '0.5',
  troughEfficiency: '78',
  operationalDays: '330'
};

export const BASIN_PRESETS: BasinPreset[] = [
  {
    id: 'port-harcourt',
    name: 'Port Harcourt Basin (Nigeria)',
    description: 'Sedimentary reservoir with high localized solar levels and standard wellbore integrity.',
    values: {
      location: 'Port Harcourt Basin',
      depth: '3500',
      age: '5',
      diameter: '9.625',
      wellType: 'coaxial',
      knownTemp: '145',
      geoGradient: '35',
      formationRock: 'sandstone',
      solarIrradiance: '5.8',
      gridDistance: '1.2',
      integrity: '8.8',
      nanofluidConcentration: '0.5',
      troughEfficiency: '78',
      operationalDays: '330'
    }
  },
  {
    id: 'imperial-valley',
    name: 'Imperial Valley Array (California)',
    description: 'High-temperature volcanic geothermal resource coupled with desert-level solar irradiance.',
    values: {
      location: 'Imperial Valley Array',
      depth: '2500',
      age: '2',
      diameter: '12.25',
      wellType: 'doublet',
      knownTemp: '220',
      geoGradient: '48',
      formationRock: 'basalt',
      solarIrradiance: '6.9',
      gridDistance: '0.5',
      integrity: '9.2',
      nanofluidConcentration: '0.7',
      troughEfficiency: '84',
      operationalDays: '350'
    }
  },
  {
    id: 'munich-molasse',
    name: 'Munich Molasse Basin (Germany)',
    description: 'Deep limestone aquifer, low solar superheating but pristine structural casing integrity.',
    values: {
      location: 'Munich Molasse Basin',
      depth: '4300',
      age: '9',
      diameter: '9.625',
      wellType: 'coaxial',
      knownTemp: '110',
      geoGradient: '28',
      formationRock: 'limestone',
      solarIrradiance: '3.1',
      gridDistance: '4.2',
      integrity: '7.8',
      nanofluidConcentration: '0.4',
      troughEfficiency: '72',
      operationalDays: '320'
    }
  },
  {
    id: 'rotorua-volcanic',
    name: 'Rotorua Superthermal Segment',
    description: 'Shallow ultra-hot reservoir with basalt fractures, old decommissioned well casing.',
    values: {
      location: 'Rotorua Superthermal Segment',
      depth: '1800',
      age: '14',
      diameter: '8.5',
      wellType: 'u-tube',
      knownTemp: '190',
      geoGradient: '55',
      formationRock: 'granite',
      solarIrradiance: '4.2',
      gridDistance: '9.5',
      integrity: '4.8',
      nanofluidConcentration: '0.3',
      troughEfficiency: '65',
      operationalDays: '310'
    }
  },
  {
    id: 'sarasota-coastal',
    name: 'Sarasota Solar-Geothermal Well',
    description: 'Aggressive coastal solar loop integrated with low-gradient downhole circulation.',
    values: {
      location: 'Sarasota Coastal Array',
      depth: '3100',
      age: '4',
      diameter: '9.625',
      wellType: 'coaxial',
      knownTemp: '105',
      geoGradient: '24',
      formationRock: 'sandstone',
      solarIrradiance: '6.4',
      gridDistance: '1.8',
      integrity: '8.2',
      nanofluidConcentration: '0.6',
      troughEfficiency: '80',
      operationalDays: '335'
    }
  }
];
