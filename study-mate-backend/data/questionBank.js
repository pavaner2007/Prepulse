const baseQuestions = [
  { examType: 'JEE', subject: 'Physics', chapter: 'Electrostatics', difficulty: 'Medium', conceptTag: 'Electric field', question: 'Two point charges +q and +q are placed at distance 2a. What is the electric field at the midpoint?', options: ['Zero', 'kq/a² toward left', '2kq/a² toward right', 'kq/4a²'], correctAnswer: 'Zero', explanation: 'Fields due to equal like charges at the midpoint are equal in magnitude and opposite in direction, so net field is zero.' },
  { examType: 'JEE', subject: 'Physics', chapter: 'Electrostatics', difficulty: 'Hard', conceptTag: 'Capacitance', question: 'A parallel plate capacitor is charged and then disconnected from the battery. If plate separation is doubled, what happens to stored energy?', options: ['Becomes half', 'Doubles', 'Remains same', 'Becomes four times'], correctAnswer: 'Doubles', explanation: 'With charge constant, C becomes C/2 and U = Q²/2C, so energy doubles.' },
  { examType: 'JEE', subject: 'Physics', chapter: 'Current Electricity', difficulty: 'Medium', conceptTag: 'Ohm law', question: 'A wire of resistance R is stretched to double its length. What is its new resistance?', options: ['R/2', 'R', '2R', '4R'], correctAnswer: '4R', explanation: 'Volume remains constant. Length doubles, area halves, so R = ρL/A becomes 4R.' },
  { examType: 'JEE', subject: 'Physics', chapter: 'Laws of Motion', difficulty: 'Easy', conceptTag: 'Friction', question: 'The maximum static friction on a body of normal reaction N is:', options: ['μsN', 'μkN', 'N/μs', 'Zero always'], correctAnswer: 'μsN', explanation: 'Maximum limiting static friction equals coefficient of static friction times normal reaction.' },
  { examType: 'JEE', subject: 'Physics', chapter: 'Optics', difficulty: 'Medium', conceptTag: 'Lens formula', question: 'For a convex lens, the image is real and same size as object when object is placed at:', options: ['F', '2F', 'Between F and 2F', 'Infinity'], correctAnswer: '2F', explanation: 'A convex lens forms a real, inverted, same-size image when the object is at 2F.' },
  { examType: 'JEE', subject: 'Chemistry', chapter: 'Some Basic Concepts in Chemistry', difficulty: 'Easy', conceptTag: 'Mole concept', question: 'How many moles are present in 18 g of water?', options: ['0.5 mol', '1 mol', '2 mol', '18 mol'], correctAnswer: '1 mol', explanation: 'Molar mass of water is 18 g/mol, so 18 g corresponds to 1 mol.' },
  { examType: 'JEE', subject: 'Chemistry', chapter: 'Chemical Bonding and Molecular Structure', difficulty: 'Medium', conceptTag: 'Hybridisation', question: 'The hybridisation of carbon in methane is:', options: ['sp', 'sp2', 'sp3', 'dsp2'], correctAnswer: 'sp3', explanation: 'Methane has four sigma bonds around carbon, giving tetrahedral sp3 hybridisation.' },
  { examType: 'JEE', subject: 'Chemistry', chapter: 'Equilibrium', difficulty: 'Medium', conceptTag: 'Le Chatelier principle', question: 'For an exothermic equilibrium reaction, increasing temperature shifts equilibrium toward:', options: ['Products', 'Reactants', 'No change', 'Catalyst side'], correctAnswer: 'Reactants', explanation: 'Heat behaves like a product in exothermic reactions, so increasing temperature shifts equilibrium backward.' },
  { examType: 'JEE', subject: 'Chemistry', chapter: 'Chemical Kinetics', difficulty: 'Medium', conceptTag: 'First order reaction', question: 'For a first order reaction, half-life depends on:', options: ['Initial concentration', 'Final concentration', 'Rate constant only', 'Pressure only'], correctAnswer: 'Rate constant only', explanation: 'For first order reaction, t1/2 = 0.693/k, independent of initial concentration.' },
  { examType: 'JEE', subject: 'Mathematics', chapter: 'Limits Continuity and Differentiability', difficulty: 'Medium', conceptTag: 'Standard limits', question: 'lim x→0 (sin x)/x equals:', options: ['0', '1', '∞', '-1'], correctAnswer: '1', explanation: 'This is a standard trigonometric limit used widely in calculus.' },
  { examType: 'JEE', subject: 'Mathematics', chapter: 'Integral Calculus', difficulty: 'Medium', conceptTag: 'Basic integration', question: '∫ 2x dx equals:', options: ['x² + C', '2x² + C', 'x + C', '2 + C'], correctAnswer: 'x² + C', explanation: 'Using power rule, integral of 2x is x² + C.' },
  { examType: 'JEE', subject: 'Mathematics', chapter: 'Matrices and Determinants', difficulty: 'Easy', conceptTag: 'Determinant', question: 'The determinant of identity matrix of order 3 is:', options: ['0', '1', '3', '-1'], correctAnswer: '1', explanation: 'The determinant of any identity matrix is 1.' },
  { examType: 'JEE', subject: 'Mathematics', chapter: 'Statistics and Probability', difficulty: 'Medium', conceptTag: 'Probability', question: 'A fair coin is tossed twice. Probability of getting exactly one head is:', options: ['1/4', '1/2', '3/4', '1'], correctAnswer: '1/2', explanation: 'Outcomes: HH, HT, TH, TT. Exactly one head occurs in HT and TH, so probability is 2/4 = 1/2.' },
  { examType: 'NEET', subject: 'Biology', chapter: 'Human Physiology', difficulty: 'Medium', conceptTag: 'Circulation', question: 'The pacemaker of the human heart is:', options: ['AV node', 'SA node', 'Bundle of His', 'Purkinje fibres'], correctAnswer: 'SA node', explanation: 'The sinoatrial node initiates cardiac impulses and is called the natural pacemaker.' },
  { examType: 'NEET', subject: 'Biology', chapter: 'Genetics and Evolution', difficulty: 'Medium', conceptTag: 'Mendelian genetics', question: 'A test cross is performed between an individual with unknown genotype and:', options: ['Homozygous dominant', 'Homozygous recessive', 'Heterozygous dominant', 'Any parent'], correctAnswer: 'Homozygous recessive', explanation: 'Test cross uses a homozygous recessive parent to reveal the genotype of the unknown dominant phenotype.' },
  { examType: 'NEET', subject: 'Biology', chapter: 'Cell Structure and Function', difficulty: 'Easy', conceptTag: 'Cell organelles', question: 'The powerhouse of the cell is:', options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Lysosome'], correctAnswer: 'Mitochondria', explanation: 'Mitochondria produce ATP through cellular respiration.' },
  { examType: 'NEET', subject: 'Biology', chapter: 'Ecology and Environment', difficulty: 'Medium', conceptTag: 'Ecosystem', question: 'The 10 percent law of energy transfer was proposed by:', options: ['Lindeman', 'Darwin', 'Mendel', 'Watson'], correctAnswer: 'Lindeman', explanation: 'Lindeman proposed that about 10% energy is transferred from one trophic level to the next.' },
  { examType: 'NEET', subject: 'Physics', chapter: 'Thermodynamics', difficulty: 'Medium', conceptTag: 'First law', question: 'In an isothermal process for an ideal gas, change in internal energy is:', options: ['Positive', 'Negative', 'Zero', 'Infinite'], correctAnswer: 'Zero', explanation: 'Internal energy of an ideal gas depends only on temperature; in isothermal process temperature is constant.' },
  { examType: 'NEET', subject: 'Chemistry', chapter: 'Biomolecules', difficulty: 'Easy', conceptTag: 'Proteins', question: 'Proteins are polymers of:', options: ['Glucose', 'Amino acids', 'Nucleotides', 'Fatty acids'], correctAnswer: 'Amino acids', explanation: 'Proteins are polypeptides formed by amino acids linked through peptide bonds.' },
]

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

const makeTemplateQuestion = ({ examType = 'JEE', subject = 'Physics', chapter = 'General', difficulty = 'Medium' }, index = 0) => {
  const templates = {
    Physics: [
      { conceptTag: chapter, question: `In ${chapter}, which habit most reduces numerical mistakes?`, options: ['Writing given values with units first', 'Skipping diagrams', 'Guessing formula directly', 'Changing units at the end only'], correctAnswer: 'Writing given values with units first', explanation: 'Most Physics mistakes come from wrong unit conversion or missing conditions; writing values first reduces errors.' },
      { conceptTag: chapter, question: `For ${chapter}, what should be done before applying a formula?`, options: ['Identify assumptions and direction/sign convention', 'Memorise answer options', 'Ignore dimensions', 'Use longest formula'], correctAnswer: 'Identify assumptions and direction/sign convention', explanation: 'JEE/NEET Physics questions often test conditions, directions and approximations before calculation.' },
    ],
    Chemistry: [
      { conceptTag: chapter, question: `In ${chapter}, what is the safest first step for a numerical/concept question?`, options: ['Balance/check the equation or concept condition', 'Directly mark the familiar option', 'Ignore units', 'Use any memorised formula'], correctAnswer: 'Balance/check the equation or concept condition', explanation: 'Chemistry questions often depend on balanced equations, limiting reagent, state, or exception conditions.' },
      { conceptTag: chapter, question: `For ${chapter}, which revision method is most useful?`, options: ['Active recall with reaction/concept maps', 'Only rereading once', 'Skipping exceptions', 'Solving without explanation review'], correctAnswer: 'Active recall with reaction/concept maps', explanation: 'Concept maps help connect reactions, mechanisms and exceptions.' },
    ],
    Mathematics: [
      { conceptTag: chapter, question: `In ${chapter}, which approach improves accuracy?`, options: ['Write domain/conditions before solving', 'Skip intermediate steps', 'Approximate every value', 'Start from options only'], correctAnswer: 'Write domain/conditions before solving', explanation: 'Math errors commonly arise from domain restrictions, sign mistakes and invalid transformations.' },
      { conceptTag: chapter, question: `For ${chapter}, which practice style is most exam-oriented?`, options: ['Mixed PYQ + timed problem solving', 'Only formula reading', 'Only easy examples', 'Avoid reviewing wrong answers'], correctAnswer: 'Mixed PYQ + timed problem solving', explanation: 'Timed mixed practice builds speed, accuracy and concept selection.' },
    ],
    Biology: [
      { conceptTag: chapter, question: `For NEET Biology chapter ${chapter}, the best primary source is:`, options: ['NCERT line-by-line understanding', 'Only coaching shortcuts', 'Random web notes', 'Ignoring diagrams'], correctAnswer: 'NCERT line-by-line understanding', explanation: 'NEET Biology is heavily NCERT-oriented; diagrams, tables and exact terms matter.' },
      { conceptTag: chapter, question: `In ${chapter}, what should you revise before a mock test?`, options: ['Key NCERT terms, diagrams and exceptions', 'Only long theory paragraphs', 'Only previous wrong answers without concepts', 'Nothing if the chapter feels familiar'], correctAnswer: 'Key NCERT terms, diagrams and exceptions', explanation: 'Many NEET Biology mistakes are memory gaps in precise terms and diagram labels.' },
    ],
  }
  const list = templates[subject] || templates.Physics
  return { id: `tpl-${index + 1}`, examType, subject, chapter, difficulty, ...list[index % list.length] }
}

const getQuestions = ({ examType, subject, chapter, difficulty, count = 5 }) => {
  const n = Math.max(1, Math.min(Number(count) || 5, 15))
  const e = normalize(examType)
  const s = normalize(subject)
  const c = normalize(chapter)
  const d = normalize(difficulty)
  let pool = baseQuestions.filter(q => (!e || normalize(q.examType) === e || q.examType === 'JEE') && (!s || normalize(q.subject) === s))
  const exact = pool.filter(q => normalize(q.chapter) === c)
  if (exact.length) pool = exact
  const diff = pool.filter(q => normalize(q.difficulty) === d)
  if (diff.length) pool = diff
  const out = []
  for (let i = 0; i < n; i += 1) {
    const q = pool[i % pool.length] || makeTemplateQuestion({ examType, subject, chapter, difficulty }, i)
    out.push({ ...q, id: `q${i + 1}` })
  }
  while (out.length < n) out.push({ ...makeTemplateQuestion({ examType, subject, chapter, difficulty }, out.length), id: `q${out.length + 1}` })
  return out
}

module.exports = { baseQuestions, getQuestions }
