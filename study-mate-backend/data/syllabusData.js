const officialSources = {
  JEE: {
    name: 'JEE Main 2026 Paper 1 official syllabus',
    authority: 'National Testing Agency',
    url: 'https://jeemain.nta.nic.in/document/syllabus-2026/',
    note: 'Use this bundled chapter map as an app-ready planning layer; verify final topic wording from the official NTA PDF before exam use.',
  },
  NEET: {
    name: 'NEET UG 2026 official syllabus',
    authority: 'National Medical Commission / NTA',
    url: 'https://www.nmc.org.in/neet/neet-ug/',
    note: 'Use this bundled chapter map as an app-ready planning layer; verify final topic wording from the official NMC/NTA PDF before exam use.',
  },
}

const syllabus = {
  JEE: {
    Physics: [
      'Physics and Measurement','Mathematics in Physics','Motion in One Dimension','Motion in Two Dimensions','Laws of Motion','Work Energy and Power','Rotational Motion','Gravitation','Properties of Solids and Liquids','Thermodynamics','Kinetic Theory of Gases','Oscillations and Waves','Electrostatics','Current Electricity','Magnetic Effects of Current and Magnetism','Electromagnetic Induction and Alternating Currents','Electromagnetic Waves','Optics','Dual Nature of Matter and Radiation','Atoms and Nuclei','Electronic Devices','Experimental Skills'
    ],
    Chemistry: [
      'Some Basic Concepts in Chemistry','Atomic Structure','Chemical Bonding and Molecular Structure','Chemical Thermodynamics','Solutions','Equilibrium','Redox Reactions and Electrochemistry','Chemical Kinetics','Classification of Elements and Periodicity','P Block Elements','D and F Block Elements','Coordination Compounds','Purification and Characterisation of Organic Compounds','Some Basic Principles of Organic Chemistry','Hydrocarbons','Organic Compounds Containing Halogens','Organic Compounds Containing Oxygen','Organic Compounds Containing Nitrogen','Biomolecules','Principles Related to Practical Chemistry'
    ],
    Mathematics: [
      'Sets Relations and Functions','Complex Numbers and Quadratic Equations','Matrices and Determinants','Permutations and Combinations','Binomial Theorem','Sequences and Series','Limits Continuity and Differentiability','Integral Calculus','Differential Equations','Coordinate Geometry','Three Dimensional Geometry','Vector Algebra','Statistics and Probability','Trigonometry'
    ],
  },
  NEET: {
    Physics: [
      'Physics and Measurement','Kinematics','Laws of Motion','Work Energy and Power','Rotational Motion','Gravitation','Properties of Solids and Liquids','Thermodynamics','Kinetic Theory of Gases','Oscillations and Waves','Electrostatics','Current Electricity','Magnetic Effects of Current and Magnetism','Electromagnetic Induction and Alternating Currents','Electromagnetic Waves','Optics','Dual Nature of Matter and Radiation','Atoms and Nuclei','Electronic Devices','Experimental Skills'
    ],
    Chemistry: [
      'Some Basic Concepts in Chemistry','Atomic Structure','Chemical Bonding and Molecular Structure','Chemical Thermodynamics','Solutions','Equilibrium','Redox Reactions and Electrochemistry','Chemical Kinetics','Classification of Elements and Periodicity','P Block Elements','D and F Block Elements','Coordination Compounds','Purification and Characterisation of Organic Compounds','Some Basic Principles of Organic Chemistry','Hydrocarbons','Organic Compounds Containing Halogens','Organic Compounds Containing Oxygen','Organic Compounds Containing Nitrogen','Biomolecules','Principles Related to Practical Chemistry'
    ],
    Biology: [
      'Diversity in Living World','Structural Organisation in Animals and Plants','Cell Structure and Function','Plant Physiology','Human Physiology','Reproduction','Genetics and Evolution','Biology and Human Welfare','Biotechnology and Its Applications','Ecology and Environment'
    ],
  },
}

const chapterMeta = {
  Physics: {
    'Electrostatics': { weight: 5, prerequisites: ['Mathematics in Physics'], concepts: ['Coulomb law','Electric field','Electric potential','Gauss law','Capacitance'], strategy: 'Master field-potential relation and solve capacitor/Gauss law numericals.' },
    'Current Electricity': { weight: 5, prerequisites: ['Electrostatics'], concepts: ['Ohm law','Kirchhoff laws','Wheatstone bridge','Potentiometer'], strategy: 'Practice circuit reduction and sign convention daily.' },
    'Laws of Motion': { weight: 4, prerequisites: ['Kinematics'], concepts: ['Free body diagram','Friction','Circular motion'], strategy: 'Draw FBD before equation writing.' },
    'Thermodynamics': { weight: 4, prerequisites: ['Kinetic Theory of Gases'], concepts: ['First law','Processes','Heat engine'], strategy: 'Create a PV graph formula sheet.' },
    'Optics': { weight: 5, prerequisites: ['Waves'], concepts: ['Ray optics','Wave optics','Interference','Diffraction'], strategy: 'Separate sign convention questions from wave optics questions.' },
  },
  Chemistry: {
    'Some Basic Concepts in Chemistry': { weight: 5, prerequisites: [], concepts: ['Mole concept','Stoichiometry','Limiting reagent'], strategy: 'Solve 20 mole-concept numericals before moving to equilibrium.' },
    'Chemical Bonding and Molecular Structure': { weight: 5, prerequisites: ['Atomic Structure'], concepts: ['VSEPR','Hybridisation','MOT','Bond order'], strategy: 'Build quick tables for geometry and magnetic behavior.' },
    'Equilibrium': { weight: 5, prerequisites: ['Some Basic Concepts in Chemistry'], concepts: ['Ionic equilibrium','Buffer','Kp Kc','Solubility product'], strategy: 'Practice approximation and ICE tables.' },
    'Organic Compounds Containing Oxygen': { weight: 4, prerequisites: ['Some Basic Principles of Organic Chemistry'], concepts: ['Alcohols','Phenols','Ethers','Carbonyls','Carboxylic acids'], strategy: 'Use reaction maps and named reactions.' },
    'Biomolecules': { weight: 3, prerequisites: [], concepts: ['Carbohydrates','Proteins','Nucleic acids'], strategy: 'Revise NCERT facts using active recall.' },
  },
  Mathematics: {
    'Limits Continuity and Differentiability': { weight: 6, prerequisites: ['Functions'], concepts: ['Limits','Continuity','Derivatives','AOD'], strategy: 'Revise standard limits and solve mixed derivative problems.' },
    'Integral Calculus': { weight: 6, prerequisites: ['Limits Continuity and Differentiability'], concepts: ['Indefinite integral','Definite integral','Area'], strategy: 'Maintain a formula + substitution pattern notebook.' },
    'Coordinate Geometry': { weight: 6, prerequisites: ['Trigonometry'], concepts: ['Straight lines','Circle','Conic sections'], strategy: 'Practice diagrams and formula selection.' },
    'Vector Algebra': { weight: 4, prerequisites: [], concepts: ['Dot product','Cross product','Scalar triple product'], strategy: 'Focus on geometry interpretation.' },
  },
  Biology: {
    'Human Physiology': { weight: 6, prerequisites: ['Cell Structure and Function'], concepts: ['Digestion','Breathing','Circulation','Excretion','Neural control','Endocrine system'], strategy: 'Use NCERT line-by-line revision plus diagrams.' },
    'Genetics and Evolution': { weight: 6, prerequisites: ['Reproduction'], concepts: ['Mendelian genetics','Molecular basis','Evolution'], strategy: 'Practice pedigree and DNA/RNA process questions.' },
    'Plant Physiology': { weight: 4, prerequisites: ['Cell Structure and Function'], concepts: ['Photosynthesis','Respiration','Plant growth','Transport'], strategy: 'Compare processes with tables and flowcharts.' },
    'Ecology and Environment': { weight: 5, prerequisites: [], concepts: ['Ecosystem','Biodiversity','Environmental issues'], strategy: 'Direct NCERT recall and PYQ revision.' },
  },
}

const getSubjects = (examType = 'JEE') => Object.keys(syllabus[examType] || syllabus.JEE)
const getChapters = (examType = 'JEE', subject) => (syllabus[examType] || syllabus.JEE)[subject] || []
const getChapterMeta = (subject, chapter) => chapterMeta[subject]?.[chapter] || { weight: 3, prerequisites: [], concepts: [chapter || subject], strategy: `Build concept clarity and solve PYQs from ${chapter || subject}.` }

const getSyllabus = (examType) => examType ? syllabus[examType] : syllabus

module.exports = { syllabus, officialSources, chapterMeta, getSubjects, getChapters, getChapterMeta, getSyllabus }
