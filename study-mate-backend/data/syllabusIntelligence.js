const { syllabus, officialSources, getSubjects, getChapters } = require('./syllabusData')

const sourceNotes = {
  JEE: {
    officialSyllabus: officialSources.JEE,
    trendBasis: 'Trend-based chapter priority estimated from recent JEE Main PYQ/question-distribution analyses. NTA publishes the syllabus, not official chapter-wise weightage.',
    ncertMeaning: 'For JEE, NCERT priority means foundational board/NCERT-aligned theory value plus direct concept recall value; problem practice still matters most.',
    lastVerified: '2026-06-29',
  },
  NEET: {
    officialSyllabus: officialSources.NEET,
    trendBasis: 'Trend-based chapter priority estimated from recent NEET PYQ/question-distribution analyses. NMC/NTA publish the syllabus, not official chapter-wise weightage.',
    ncertMeaning: 'For NEET, NCERT priority is critical, especially in Biology and Inorganic/Organic Chemistry.',
    lastVerified: '2026-06-29',
  },
}

const defaults = {
  JEE: {
    Physics: { classLevel: 'Mixed', weightagePercent: 3.2, pyqFrequency: 6, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 1, revisionCycleDays: 6, expectedMarks: 4, microTopics: ['Core concept', 'Formula application', 'PYQ practice'], commonMistakes: ['Skipping units/sign convention', 'Formula selection error'], strategyTags: ['Concept + numericals'] },
    Chemistry: { classLevel: 'Mixed', weightagePercent: 3.4, pyqFrequency: 6, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, revisionCycleDays: 5, expectedMarks: 4, microTopics: ['NCERT theory', 'Exceptions', 'PYQ patterns'], commonMistakes: ['Ignoring exceptions', 'Weak reaction/concept mapping'], strategyTags: ['NCERT + PYQ'] },
    Mathematics: { classLevel: 'Mixed', weightagePercent: 4.5, pyqFrequency: 6, ncertPriority: 4, difficulty: 'Hard', avgQuestions: 1, revisionCycleDays: 6, expectedMarks: 4, microTopics: ['Formula recall', 'Problem pattern', 'Timed solving'], commonMistakes: ['Domain/sign mistakes', 'Long calculation without checking constraints'], strategyTags: ['Timed practice'] },
  },
  NEET: {
    Physics: { classLevel: 'Mixed', weightagePercent: 4.5, pyqFrequency: 6, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, revisionCycleDays: 5, expectedMarks: 8, microTopics: ['Formula application', 'Units', 'Numericals'], commonMistakes: ['Calculation pressure', 'Wrong formula condition'], strategyTags: ['Numerical accuracy'] },
    Chemistry: { classLevel: 'Mixed', weightagePercent: 4.8, pyqFrequency: 6, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 2, revisionCycleDays: 5, expectedMarks: 8, microTopics: ['NCERT facts', 'Numericals/reactions', 'Exceptions'], commonMistakes: ['Not revising NCERT lines', 'Mechanism/exception confusion'], strategyTags: ['NCERT + PYQ'] },
    Biology: { classLevel: 'Mixed', weightagePercent: 8.5, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 8, revisionCycleDays: 4, expectedMarks: 32, microTopics: ['NCERT line-by-line', 'Diagrams', 'Tables/examples'], commonMistakes: ['Memory gap in exact NCERT wording', 'Diagram/table recall errors'], strategyTags: ['NCERT first', 'High scoring'] },
  },
}

const intelligenceOverrides = {
  JEE: {
    Physics: {
      'Physics and Measurement': { classLevel: '11', weightagePercent: 4.2, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Easy', avgQuestions: 1, expectedMarks: 4, microTopics: ['Units', 'Dimensions', 'Error analysis', 'Significant figures'], commonMistakes: ['Dimensional formula confusion', 'Rounding/significant figure error'], strategyTags: ['Quick score', 'Formula sheet'] },
      'Motion in One Dimension': { classLevel: '11', weightagePercent: 2.6, pyqFrequency: 5, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Graphs', 'Relative velocity', 'Equations of motion'], commonMistakes: ['Graph slope/area confusion', 'Sign convention error'] },
      'Motion in Two Dimensions': { classLevel: '11', weightagePercent: 2.9, pyqFrequency: 5, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Projectile motion', 'Relative velocity', 'Vectors'], commonMistakes: ['Breaking vectors incorrectly', 'Range/time confusion'] },
      'Laws of Motion': { classLevel: '11', weightagePercent: 2.8, pyqFrequency: 6, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 1, microTopics: ['FBD', 'Friction', 'Pseudo force', 'Circular motion'], commonMistakes: ['Not drawing FBD', 'Wrong friction direction'], strategyTags: ['Foundation critical'] },
      'Work Energy and Power': { classLevel: '11', weightagePercent: 2.7, pyqFrequency: 6, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Work-energy theorem', 'Power', 'Conservative forces'], commonMistakes: ['Energy sign errors', 'Confusing force and work'] },
      'Rotational Motion': { classLevel: '11', weightagePercent: 4.4, pyqFrequency: 8, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, expectedMarks: 8, microTopics: ['Torque', 'Moment of inertia', 'Rolling motion', 'Angular momentum'], commonMistakes: ['Axis selection error', 'Missing rolling constraint'], strategyTags: ['High Yield', 'Hard numericals'] },
      'Gravitation': { classLevel: '11', weightagePercent: 4.5, pyqFrequency: 7, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Field/potential', 'Satellites', 'Escape velocity'], commonMistakes: ['Potential sign mistake', 'Orbit formula confusion'] },
      'Properties of Solids and Liquids': { classLevel: '11', weightagePercent: 4.8, pyqFrequency: 7, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Elasticity', 'Viscosity', 'Surface tension', 'Fluid mechanics'], commonMistakes: ['Wrong units', 'Bernoulli condition ignored'] },
      'Thermodynamics': { classLevel: '11', weightagePercent: 3.1, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, microTopics: ['First law', 'Processes', 'PV graph', 'Heat engine'], commonMistakes: ['Sign convention of work', 'Process formula mix-up'], strategyTags: ['High utility'] },
      'Kinetic Theory of Gases': { classLevel: '11', weightagePercent: 2.9, pyqFrequency: 5, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 1, microTopics: ['RMS speed', 'Degrees of freedom', 'Mean free path'], commonMistakes: ['Using wrong speed formula', 'Cp/Cv confusion'] },
      'Oscillations and Waves': { classLevel: '11', weightagePercent: 5.2, pyqFrequency: 7, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 2, microTopics: ['SHM', 'Waves', 'Sound', 'Doppler effect'], commonMistakes: ['Phase confusion', 'Wrong effective spring constant'], strategyTags: ['Recurring'] },
      'Electrostatics': { classLevel: '12', weightagePercent: 7.7, pyqFrequency: 9, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 2, expectedMarks: 8, microTopics: ['Coulomb law', 'Electric field', 'Gauss law', 'Potential', 'Capacitance'], commonMistakes: ['Vector direction error', 'Gauss surface selection error', 'Capacitor energy condition'], strategyTags: ['High Yield', 'Electrodynamics base'] },
      'Current Electricity': { classLevel: '12', weightagePercent: 6.6, pyqFrequency: 9, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 2, expectedMarks: 8, microTopics: ['Ohm law', 'Kirchhoff laws', 'Wheatstone bridge', 'Meter bridge', 'Potentiometer'], commonMistakes: ['Wrong loop direction', 'Equivalent resistance shortcut misuse'], strategyTags: ['High Yield', 'Scoring numericals'] },
      'Magnetic Effects of Current and Magnetism': { classLevel: '12', weightagePercent: 4.8, pyqFrequency: 8, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, microTopics: ['Biot-Savart', 'Ampere law', 'Lorentz force', 'Torque on loop'], commonMistakes: ['Right-hand rule error', 'Radius/current formula confusion'] },
      'Electromagnetic Induction and Alternating Currents': { classLevel: '12', weightagePercent: 7.0, pyqFrequency: 8, ncertPriority: 6, difficulty: 'Hard', avgQuestions: 2, expectedMarks: 8, microTopics: ['Faraday law', 'Lenz law', 'LR/LC circuits', 'AC power', 'Transformer'], commonMistakes: ['Sign of induced current', 'RMS/peak confusion'], strategyTags: ['High Yield'] },
      'Optics': { classLevel: '12', weightagePercent: 8.6, pyqFrequency: 9, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 2, expectedMarks: 8, microTopics: ['Ray optics', 'Lens/mirror formula', 'Interference', 'Diffraction', 'Polarisation'], commonMistakes: ['Sign convention mismatch', 'Fringe width formula error'], strategyTags: ['High Yield', 'Frequent'] },
      'Dual Nature of Matter and Radiation': { classLevel: '12', weightagePercent: 3.8, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Easy', avgQuestions: 1, microTopics: ['Photoelectric effect', 'de Broglie wavelength'], commonMistakes: ['Threshold frequency/work function confusion'], strategyTags: ['Quick score'] },
      'Atoms and Nuclei': { classLevel: '12', weightagePercent: 4.0, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Easy', avgQuestions: 1, microTopics: ['Bohr model', 'Radioactivity', 'Nuclear binding energy'], commonMistakes: ['Half-life equation error', 'Energy level sign'] },
      'Electronic Devices': { classLevel: '12', weightagePercent: 3.9, pyqFrequency: 7, ncertPriority: 8, difficulty: 'Easy', avgQuestions: 1, microTopics: ['Semiconductors', 'Diodes', 'Logic gates'], commonMistakes: ['P-N junction bias confusion', 'Logic gate table errors'], strategyTags: ['NCERT scoring'] },
    },
    Chemistry: {
      'Some Basic Concepts in Chemistry': { classLevel: '11', weightagePercent: 2.8, pyqFrequency: 7, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Mole concept', 'Stoichiometry', 'Limiting reagent', 'Concentration terms'], commonMistakes: ['Unit conversion error', 'Limiting reagent missed'], strategyTags: ['Foundation'] },
      'Atomic Structure': { classLevel: '11', weightagePercent: 3.3, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Quantum numbers', 'Bohr model', 'Electronic configuration'], commonMistakes: ['Quantum number restriction error'] },
      'Chemical Bonding and Molecular Structure': { classLevel: '11', weightagePercent: 3.3, pyqFrequency: 8, ncertPriority: 9, difficulty: 'Medium', avgQuestions: 1, microTopics: ['VSEPR', 'Hybridisation', 'MOT', 'Bond order', 'Dipole moment'], commonMistakes: ['Geometry vs shape confusion', 'MOT order mistake'], strategyTags: ['NCERT high priority'] },
      'Chemical Thermodynamics': { classLevel: '11', weightagePercent: 3.7, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Enthalpy', 'Entropy', 'Gibbs energy', 'Hess law'], commonMistakes: ['Sign of ΔG/ΔH', 'Unit mismatch'] },
      'Solutions': { classLevel: '12', weightagePercent: 4.0, pyqFrequency: 8, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Raoult law', 'Colligative properties', 'Abnormal molar mass'], commonMistakes: ['Van’t Hoff factor misuse'] },
      'Equilibrium': { classLevel: '11', weightagePercent: 4.4, pyqFrequency: 8, ncertPriority: 8, difficulty: 'Hard', avgQuestions: 1, microTopics: ['Kp/Kc', 'Ionic equilibrium', 'Buffer', 'Ksp', 'pH'], commonMistakes: ['Approximation without validation', 'pH/log error'], strategyTags: ['High Yield'] },
      'Redox Reactions and Electrochemistry': { classLevel: 'Mixed', weightagePercent: 4.8, pyqFrequency: 8, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Oxidation number', 'Nernst equation', 'Conductance', 'Electrolysis'], commonMistakes: ['Wrong oxidation number', 'log/Nernst sign error'], strategyTags: ['High Yield'] },
      'Chemical Kinetics': { classLevel: '12', weightagePercent: 3.8, pyqFrequency: 7, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Rate law', 'Order', 'Half-life', 'Arrhenius equation'], commonMistakes: ['Molecularity/order confusion'] },
      'Coordination Compounds': { classLevel: '12', weightagePercent: 6.5, pyqFrequency: 9, ncertPriority: 9, difficulty: 'Medium', avgQuestions: 2, expectedMarks: 8, microTopics: ['IUPAC naming', 'Isomerism', 'CFT', 'Magnetic moment'], commonMistakes: ['Oxidation state error', 'Weak/strong ligand confusion'], strategyTags: ['High Yield', 'NCERT scoring'] },
      'Some Basic Principles of Organic Chemistry': { classLevel: '11', weightagePercent: 6.2, pyqFrequency: 9, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 2, microTopics: ['GOC', 'Isomerism', 'Electronic effects', 'Reaction intermediates'], commonMistakes: ['Acidity/basicity order mistake', 'Intermediate stability confusion'], strategyTags: ['Organic foundation'] },
      'Hydrocarbons': { classLevel: '11', weightagePercent: 2.5, pyqFrequency: 6, ncertPriority: 7, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic compounds'], commonMistakes: ['Markovnikov/peroxide confusion'] },
      'Organic Compounds Containing Halogens': { classLevel: '12', weightagePercent: 4.1, pyqFrequency: 8, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 1, microTopics: ['SN1/SN2', 'E1/E2', 'Haloarenes'], commonMistakes: ['Mechanism selection error'] },
      'Organic Compounds Containing Oxygen': { classLevel: '12', weightagePercent: 6.3, pyqFrequency: 9, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Alcohols', 'Phenols', 'Ethers', 'Aldehydes', 'Ketones', 'Carboxylic acids'], commonMistakes: ['Oxidation/reduction reagent confusion'], strategyTags: ['High Yield'] },
      'Organic Compounds Containing Nitrogen': { classLevel: '12', weightagePercent: 3.5, pyqFrequency: 7, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Amines', 'Diazonium salts', 'Nitro compounds'], commonMistakes: ['Basicity order error'] },
      'Biomolecules': { classLevel: '12', weightagePercent: 2.9, pyqFrequency: 7, ncertPriority: 10, difficulty: 'Easy', avgQuestions: 1, microTopics: ['Carbohydrates', 'Proteins', 'Nucleic acids', 'Vitamins'], commonMistakes: ['NCERT factual mismatch'], strategyTags: ['Quick NCERT score'] },
      'Principles Related to Practical Chemistry': { classLevel: 'Mixed', weightagePercent: 3.0, pyqFrequency: 6, ncertPriority: 9, difficulty: 'Easy', avgQuestions: 1, microTopics: ['Salt analysis', 'Lab tests', 'Titration basics'], commonMistakes: ['Test/reagent confusion'], strategyTags: ['NCERT practical'] },
    },
    Mathematics: {
      'Sets Relations and Functions': { classLevel: 'Mixed', weightagePercent: 4.0, pyqFrequency: 7, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Sets', 'Relations', 'Functions', 'Inverse functions'], commonMistakes: ['Domain/range error'] },
      'Complex Numbers and Quadratic Equations': { classLevel: '11', weightagePercent: 8.1, pyqFrequency: 8, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Complex plane', 'Roots', 'Argand diagram', 'Quadratic theory'], commonMistakes: ['Argument/quadrant mistake'], strategyTags: ['High Yield'] },
      'Matrices and Determinants': { classLevel: '12', weightagePercent: 7.5, pyqFrequency: 9, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 2, expectedMarks: 8, microTopics: ['Matrix operations', 'Determinants', 'Inverse', 'Linear equations'], commonMistakes: ['Cofactor/sign error', 'Order mismatch'], strategyTags: ['High Yield', 'Scoring'] },
      'Permutations and Combinations': { classLevel: '11', weightagePercent: 3.6, pyqFrequency: 7, ncertPriority: 4, difficulty: 'Hard', avgQuestions: 1, microTopics: ['Counting principle', 'Arrangements', 'Combinations'], commonMistakes: ['Overcounting cases'] },
      'Binomial Theorem': { classLevel: '11', weightagePercent: 5.1, pyqFrequency: 8, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 1, microTopics: ['General term', 'Middle term', 'Expansion'], commonMistakes: ['Index shift error'], strategyTags: ['Frequent'] },
      'Sequences and Series': { classLevel: '11', weightagePercent: 5.7, pyqFrequency: 8, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 1, microTopics: ['AP/GP', 'Special series', 'Sigma notation'], commonMistakes: ['n vs n-1 error'], strategyTags: ['Frequent'] },
      'Limits Continuity and Differentiability': { classLevel: '12', weightagePercent: 10.2, pyqFrequency: 9, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, expectedMarks: 8, microTopics: ['Standard limits', 'Continuity', 'Differentiability', 'AOD'], commonMistakes: ['LHL/RHL not checked', 'Derivative condition missed'], strategyTags: ['High Yield', 'Calculus core'] },
      'Integral Calculus': { classLevel: '12', weightagePercent: 9.7, pyqFrequency: 9, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, expectedMarks: 8, microTopics: ['Indefinite integrals', 'Definite integrals', 'Area under curve'], commonMistakes: ['Substitution mismatch', 'Limits not changed'], strategyTags: ['High Yield'] },
      'Differential Equations': { classLevel: '12', weightagePercent: 4.2, pyqFrequency: 8, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Variable separable', 'Linear DE', 'Order/degree'], commonMistakes: ['Integrating factor error'], strategyTags: ['Scoring'] },
      'Coordinate Geometry': { classLevel: 'Mixed', weightagePercent: 10.0, pyqFrequency: 9, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 3, expectedMarks: 12, microTopics: ['Straight lines', 'Circle', 'Parabola', 'Ellipse', 'Hyperbola'], commonMistakes: ['Wrong conic formula', 'Diagram not drawn'], strategyTags: ['High Yield'] },
      'Three Dimensional Geometry': { classLevel: '12', weightagePercent: 7.4, pyqFrequency: 9, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 2, expectedMarks: 8, microTopics: ['Direction cosines', 'Lines', 'Planes', 'Shortest distance'], commonMistakes: ['Vector-plane formula confusion'], strategyTags: ['High Yield'] },
      'Vector Algebra': { classLevel: '12', weightagePercent: 4.7, pyqFrequency: 8, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Dot product', 'Cross product', 'Scalar triple product'], commonMistakes: ['Direction/cross product sign error'], strategyTags: ['Frequent'] },
      'Statistics and Probability': { classLevel: 'Mixed', weightagePercent: 6.0, pyqFrequency: 8, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Probability', 'Statistics', 'Random variables'], commonMistakes: ['Conditional probability setup error'], strategyTags: ['Scoring'] },
      'Trigonometry': { classLevel: '11', weightagePercent: 3.5, pyqFrequency: 6, ncertPriority: 4, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Identities', 'Equations', 'Inverse trig'], commonMistakes: ['Quadrant/domain error'] },
    },
  },
  NEET: {
    Physics: {
      'Physics and Measurement': { classLevel: '11', weightagePercent: 3.0, pyqFrequency: 6, ncertPriority: 7, difficulty: 'Easy', avgQuestions: 1, microTopics: ['Units', 'Dimensions', 'Errors'], commonMistakes: ['Dimensional formula error'], strategyTags: ['Quick score'] },
      'Kinematics': { classLevel: '11', weightagePercent: 4.0, pyqFrequency: 6, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Graphs', 'Projectile', 'Relative motion'], commonMistakes: ['Graph interpretation'] },
      'Laws of Motion': { classLevel: '11', weightagePercent: 7.0, pyqFrequency: 8, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 3, expectedMarks: 12, microTopics: ['FBD', 'Friction', 'Circular motion'], commonMistakes: ['Friction direction error'], strategyTags: ['High Yield'] },
      'Rotational Motion': { classLevel: '11', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, microTopics: ['Torque', 'Angular momentum', 'Rolling'], commonMistakes: ['Moment of inertia selection'] },
      'Gravitation': { classLevel: '11', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Satellites', 'Escape velocity', 'Field/potential'], commonMistakes: ['Formula condition mistake'] },
      'Thermodynamics': { classLevel: '11', weightagePercent: 6.0, pyqFrequency: 8, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 2, microTopics: ['First law', 'Processes', 'Heat engine'], commonMistakes: ['Sign convention'], strategyTags: ['High Yield'] },
      'Oscillations and Waves': { classLevel: '11', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 5, difficulty: 'Medium', avgQuestions: 2, microTopics: ['SHM', 'Sound waves', 'Doppler'], commonMistakes: ['Phase/frequency confusion'] },
      'Electrostatics': { classLevel: '12', weightagePercent: 7.0, pyqFrequency: 8, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 3, expectedMarks: 12, microTopics: ['Electric field', 'Potential', 'Capacitance'], commonMistakes: ['Vector direction', 'Capacitor condition'], strategyTags: ['High Yield'] },
      'Current Electricity': { classLevel: '12', weightagePercent: 6.0, pyqFrequency: 8, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Circuits', 'Kirchhoff law', 'Meters'], commonMistakes: ['Loop/sign error'], strategyTags: ['High Yield'] },
      'Magnetic Effects of Current and Magnetism': { classLevel: '12', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 5, difficulty: 'Hard', avgQuestions: 2, microTopics: ['Lorentz force', 'Biot-Savart', 'Torque'], commonMistakes: ['Direction rule error'] },
      'Optics': { classLevel: '12', weightagePercent: 6.0, pyqFrequency: 8, ncertPriority: 6, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Ray optics', 'Wave optics'], commonMistakes: ['Sign convention'], strategyTags: ['High Yield'] },
      'Atoms and Nuclei': { classLevel: '12', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 8, difficulty: 'Easy', avgQuestions: 2, microTopics: ['Bohr model', 'Radioactivity'], commonMistakes: ['Half-life formula'], strategyTags: ['Quick score'] },
    },
    Chemistry: {
      'Some Basic Concepts in Chemistry': { classLevel: '11', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 9, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Mole concept', 'Stoichiometry'], commonMistakes: ['Mole ratio mistake'], strategyTags: ['Foundation'] },
      'Atomic Structure': { classLevel: '11', weightagePercent: 3.0, pyqFrequency: 6, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 1, microTopics: ['Quantum numbers', 'Electronic configuration'], commonMistakes: ['Orbital filling error'] },
      'Chemical Bonding and Molecular Structure': { classLevel: '11', weightagePercent: 8.0, pyqFrequency: 9, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 4, expectedMarks: 16, microTopics: ['VSEPR', 'Hybridisation', 'MOT', 'Bonding exceptions'], commonMistakes: ['Shape vs geometry'], strategyTags: ['High Yield', 'NCERT must'] },
      'Chemical Thermodynamics': { classLevel: '11', weightagePercent: 5.0, pyqFrequency: 7, ncertPriority: 8, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Enthalpy', 'Entropy', 'Gibbs energy'], commonMistakes: ['Sign of ΔG'] },
      'Equilibrium': { classLevel: '11', weightagePercent: 6.0, pyqFrequency: 8, ncertPriority: 8, difficulty: 'Hard', avgQuestions: 3, microTopics: ['Ionic equilibrium', 'Buffer', 'pH'], commonMistakes: ['Approximation error'], strategyTags: ['High Yield'] },
      'Coordination Compounds': { classLevel: '12', weightagePercent: 5.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Nomenclature', 'Isomerism', 'CFT'], commonMistakes: ['Oxidation state'], strategyTags: ['NCERT scoring'] },
      'D and F Block Elements': { classLevel: '12', weightagePercent: 3.0, pyqFrequency: 6, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Trends', 'Oxidation states', 'Compounds'], commonMistakes: ['NCERT table recall'] },
      'P Block Elements': { classLevel: 'Mixed', weightagePercent: 6.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 3, microTopics: ['Group trends', 'Compounds', 'Reactions'], commonMistakes: ['Exception confusion'], strategyTags: ['NCERT must'] },
      'Some Basic Principles of Organic Chemistry': { classLevel: '11', weightagePercent: 7.0, pyqFrequency: 9, ncertPriority: 9, difficulty: 'Medium', avgQuestions: 3, microTopics: ['GOC', 'Isomerism', 'Electronic effects'], commonMistakes: ['Intermediate stability'], strategyTags: ['Organic foundation'] },
      'Hydrocarbons': { classLevel: '11', weightagePercent: 4.0, pyqFrequency: 7, ncertPriority: 9, difficulty: 'Medium', avgQuestions: 2, microTopics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic'], commonMistakes: ['Reaction condition'] },
      'Organic Compounds Containing Oxygen': { classLevel: '12', weightagePercent: 7.0, pyqFrequency: 9, ncertPriority: 9, difficulty: 'Medium', avgQuestions: 3, microTopics: ['Alcohols', 'Phenols', 'Carbonyls', 'Carboxylic acids'], commonMistakes: ['Reagent selection'], strategyTags: ['High Yield'] },
      'Biomolecules': { classLevel: '12', weightagePercent: 4.0, pyqFrequency: 7, ncertPriority: 10, difficulty: 'Easy', avgQuestions: 2, microTopics: ['Carbohydrates', 'Proteins', 'Nucleic acids'], commonMistakes: ['Exact NCERT term'], strategyTags: ['Quick score'] },
      'Principles Related to Practical Chemistry': { classLevel: 'Mixed', weightagePercent: 4.0, pyqFrequency: 7, ncertPriority: 10, difficulty: 'Easy', avgQuestions: 2, microTopics: ['Salt analysis', 'Lab observations', 'Titration'], commonMistakes: ['Reagent/test mismatch'], strategyTags: ['NCERT practical'] },
    },
    Biology: {
      'Diversity in Living World': { classLevel: '11', weightagePercent: 12.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 11, expectedMarks: 44, microTopics: ['Animal kingdom', 'Plant kingdom', 'Biological classification', 'Taxonomy'], commonMistakes: ['Examples/feature mismatch', 'NCERT table missed'], strategyTags: ['High Yield', 'NCERT diagrams'] },
      'Structural Organisation in Animals and Plants': { classLevel: '11', weightagePercent: 6.0, pyqFrequency: 6, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 5, expectedMarks: 20, microTopics: ['Morphology', 'Anatomy', 'Animal tissues'], commonMistakes: ['Diagram/table recall error'] },
      'Cell Structure and Function': { classLevel: '11', weightagePercent: 9.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 8, expectedMarks: 32, microTopics: ['Cell unit', 'Biomolecules', 'Cell cycle'], commonMistakes: ['Organelle function confusion'], strategyTags: ['High Yield'] },
      'Plant Physiology': { classLevel: '11', weightagePercent: 8.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 7, expectedMarks: 28, microTopics: ['Photosynthesis', 'Respiration', 'Transport', 'Plant growth'], commonMistakes: ['Pathway sequence confusion'], strategyTags: ['High Yield'] },
      'Human Physiology': { classLevel: '11', weightagePercent: 16.0, pyqFrequency: 10, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 14, expectedMarks: 56, microTopics: ['Digestion', 'Breathing', 'Circulation', 'Excretion', 'Neural control', 'Endocrine'], commonMistakes: ['Diagram label/sequence error', 'Hormone/function confusion'], strategyTags: ['Highest Yield', 'NCERT line-by-line'] },
      'Reproduction': { classLevel: '12', weightagePercent: 10.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 9, expectedMarks: 36, microTopics: ['Reproduction in organisms', 'Flowering plants', 'Human reproduction', 'Reproductive health'], commonMistakes: ['Life-cycle sequence error'], strategyTags: ['High Yield'] },
      'Genetics and Evolution': { classLevel: '12', weightagePercent: 14.0, pyqFrequency: 10, ncertPriority: 10, difficulty: 'Hard', avgQuestions: 12, expectedMarks: 48, microTopics: ['Mendelian genetics', 'Molecular basis', 'Evolution'], commonMistakes: ['Pedigree/probability setup', 'DNA/RNA process confusion'], strategyTags: ['Highest Yield'] },
      'Biology and Human Welfare': { classLevel: '12', weightagePercent: 6.0, pyqFrequency: 7, ncertPriority: 10, difficulty: 'Easy', avgQuestions: 5, expectedMarks: 20, microTopics: ['Health/disease', 'Microbes', 'Human welfare'], commonMistakes: ['Pathogen/disease mismatch'], strategyTags: ['NCERT direct'] },
      'Biotechnology and Its Applications': { classLevel: '12', weightagePercent: 8.0, pyqFrequency: 8, ncertPriority: 10, difficulty: 'Medium', avgQuestions: 7, expectedMarks: 28, microTopics: ['Biotech principles', 'Tools', 'Applications'], commonMistakes: ['Enzyme/vector confusion'], strategyTags: ['High Yield'] },
      'Ecology and Environment': { classLevel: '12', weightagePercent: 11.0, pyqFrequency: 9, ncertPriority: 10, difficulty: 'Easy', avgQuestions: 10, expectedMarks: 40, microTopics: ['Organisms/populations', 'Ecosystem', 'Biodiversity', 'Environmental issues'], commonMistakes: ['Graph/example recall error'], strategyTags: ['High Yield', 'Quick score'] },
    },
  },
}

const difficultyPenalty = { Easy: 0, Medium: 4, Hard: 8 }

const priorityBandFor = (score) => {
  if (score >= 82) return 'Attack First'
  if (score >= 68) return 'High Yield'
  if (score >= 52) return 'Maintain'
  return 'Low Frequency'
}

const computePriorityScore = (row) => {
  const score = (Number(row.weightagePercent || 0) * 4.2)
    + (Number(row.pyqFrequency || 0) * 3.5)
    + (Number(row.ncertPriority || 0) * 2.2)
    + (Number(row.avgQuestions || 0) * 2.5)
    - (difficultyPenalty[row.difficulty] || 0)
  return Math.max(20, Math.min(100, Math.round(score)))
}

const withComputedFields = (examType, subject, chapter, raw = {}) => {
  const base = defaults[examType]?.[subject] || defaults.JEE.Physics
  const row = { ...base, ...raw }
  const priorityScore = computePriorityScore(row)
  const expectedMarks = row.expectedMarks || Math.max(4, Math.round(Number(row.avgQuestions || 1) * 4))
  return {
    examType,
    subject,
    chapter,
    ...row,
    expectedMarks,
    priorityScore,
    priorityBand: priorityBandFor(priorityScore),
    revisionCycleDays: row.revisionCycleDays || (priorityScore >= 82 ? 3 : priorityScore >= 68 ? 5 : 7),
    dataNature: 'trend-based-priority',
  }
}

const getChapterIntelligence = (examType = 'JEE', subject, chapter) => {
  const e = syllabus[examType] ? examType : 'JEE'
  const s = subject || getSubjects(e)[0]
  const c = chapter || getChapters(e, s)[0]
  const raw = intelligenceOverrides[e]?.[s]?.[c] || {}
  return withComputedFields(e, s, c, raw)
}

const getSubjectIntelligence = (examType = 'JEE', subject) => {
  const e = syllabus[examType] ? examType : 'JEE'
  const s = subject || getSubjects(e)[0]
  return getChapters(e, s).map((chapter) => getChapterIntelligence(e, s, chapter)).sort((a, b) => b.priorityScore - a.priorityScore)
}

const getExamIntelligence = (examType = 'JEE') => {
  const e = syllabus[examType] ? examType : 'JEE'
  return getSubjects(e).reduce((acc, subject) => {
    acc[subject] = getSubjectIntelligence(e, subject)
    return acc
  }, {})
}

const daysBetween = (from, to) => Math.max(0, Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)))
const avg = (items, getter, fallback = null) => items.length ? Math.round(items.reduce((sum, item) => sum + Number(getter(item) || 0), 0) / items.length) : fallback

const rankChaptersForStudent = ({ examType = 'JEE', profile, attempts = [], mastery = [], mistakes = [], resources = [] }) => {
  const e = syllabus[examType] ? examType : 'JEE'
  const all = Object.values(getExamIntelligence(e)).flat()
  const targetDate = profile?.targetExamDate ? new Date(profile.targetExamDate) : null
  const daysLeft = targetDate ? daysBetween(new Date(), targetDate) : 120
  return all.map((item) => {
    const chapterAttempts = attempts.filter((a) => a.subject === item.subject && a.chapter === item.chapter)
    const chapterMastery = mastery.filter((m) => m.subject === item.subject && m.chapter === item.chapter)
    const chapterMistakes = mistakes.filter((m) => m.subject === item.subject && m.chapter === item.chapter)
    const hasResource = resources.some((r) => r.subject === item.subject && r.chapter === item.chapter)
    const accuracy = avg(chapterAttempts, (a) => a.accuracy, null)
    const masteryScore = avg(chapterMastery, (m) => m.masteryScore, accuracy ?? 55)
    const lastPracticed = chapterMastery[0]?.lastPracticed || chapterAttempts[0]?.createdAt || null
    const daysSincePractice = lastPracticed ? daysBetween(lastPracticed, new Date()) : 999
    const profileWeakBoost = profile?.weakSubjects?.includes(item.subject) ? 12 : 0
    const mistakePenalty = Math.min(25, chapterMistakes.length * 8)
    const gapUrgency = Math.max(0, 100 - Number(masteryScore || 55)) * 0.45
    const revisionUrgency = daysSincePractice > item.revisionCycleDays ? 12 : 0
    const examPressure = daysLeft <= 45 ? 10 : daysLeft <= 90 ? 6 : 0
    const noResourcePenalty = hasResource ? 0 : 4
    const actionScore = Math.round(item.priorityScore * 0.52 + gapUrgency + mistakePenalty + revisionUrgency + profileWeakBoost + examPressure + noResourcePenalty)
    const revisionDue = Number(masteryScore || 0) < 70 || chapterMistakes.length > 0 || daysSincePractice > item.revisionCycleDays
    return {
      ...item,
      studentAccuracy: accuracy ?? masteryScore,
      masteryScore: Math.max(10, Math.min(100, Math.round(Number(masteryScore || 55) - chapterMistakes.length * 4))),
      mistakeCount: chapterMistakes.length,
      hasResource,
      daysSincePractice,
      revisionDue,
      actionScore: Math.max(10, Math.min(100, actionScore)),
      scoreImpact: item.expectedMarks >= 12 ? 'Very High' : item.expectedMarks >= 8 ? 'High' : 'Medium',
      recommendedAction: buildChapterAction(item, chapterMistakes.length, masteryScore),
    }
  }).sort((a, b) => b.actionScore - a.actionScore)
}

const buildChapterAction = (item, mistakeCount = 0, masteryScore = 55) => {
  if (mistakeCount >= 2) return `Repair repeated mistakes in ${item.microTopics.slice(0, 2).join(' + ')} before solving a timed PYQ set.`
  if (masteryScore < 55) return `Rebuild fundamentals from ${item.microTopics.slice(0, 3).join(', ')} and solve easy→medium questions.`
  if (item.priorityScore >= 80) return `Prioritize this as a high-yield scoring chapter; revise theory and solve a timed PYQ-style set.`
  return `Maintain with short revision and 10 mixed questions.`
}

const buildStrategySummary = ({ examType = 'JEE', profile, attempts = [], mastery = [], mistakes = [], resources = [] }) => {
  const ranked = rankChaptersForStudent({ examType, profile, attempts, mastery, mistakes, resources })
  const attackFirst = ranked.filter((item) => item.priorityBand === 'Attack First').slice(0, 8)
  const neglectedHighYield = ranked.filter((item) => !item.hasResource && item.priorityScore >= 70).slice(0, 8)
  const revisionDue = ranked.filter((item) => item.revisionDue).slice(0, 10)
  const avgPriorityCoverage = ranked.length ? Math.round(ranked.reduce((sum, item) => sum + (item.hasResource || item.studentAccuracy >= 70 ? item.priorityScore : 0), 0) / ranked.reduce((sum, item) => sum + item.priorityScore, 0) * 100) : 0
  return {
    examType,
    generatedAt: new Date().toISOString(),
    sourceNotes: sourceNotes[examType] || sourceNotes.JEE,
    priorityFormula: 'Action Score = 52% syllabus priority + mastery gap + mistakes + revision gap + target-date pressure + weak-subject boost',
    weightedCoveragePercent: Number.isFinite(avgPriorityCoverage) ? avgPriorityCoverage : 0,
    attackFirst,
    neglectedHighYield,
    revisionDue,
    topPriority: ranked.slice(0, 12),
  }
}

module.exports = {
  sourceNotes,
  getChapterIntelligence,
  getSubjectIntelligence,
  getExamIntelligence,
  rankChaptersForStudent,
  buildStrategySummary,
}
