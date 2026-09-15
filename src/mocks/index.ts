import type {
  Exercise,
  Lesson,
  StudentProfileSummary,
  Subject,
  TeachingRelationship,
  TeachingRelationshipStatus,
  UserSummary,
} from '../types'

const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString()
const minutesAgo = (n: number) => new Date(now.getTime() - n * 60_000).toISOString()

export const mockUsers: UserSummary[] = [
  {
    id: 't_paula',
    email: 'paula@aprende.mais',
    displayName: 'Paula Carvalho',
    role: 'TEACHER',
    birthDate: null,
    createdAt: daysAgo(180),
  },
  {
    id: 't_rui',
    email: 'rui@aprende.mais',
    displayName: 'Rui Tavares',
    role: 'TEACHER',
    birthDate: null,
    createdAt: daysAgo(120),
  },
  {
    id: 's_ana',
    email: 'ana@aprende.mais',
    displayName: 'Ana Lima',
    role: 'STUDENT',
    birthDate: '2014-04-12T00:00:00.000Z',
    createdAt: daysAgo(90),
  },
  {
    id: 's_marco',
    email: 'marco@aprende.mais',
    displayName: 'Marco Sousa',
    role: 'STUDENT',
    birthDate: '2013-09-03T00:00:00.000Z',
    createdAt: daysAgo(60),
  },
  {
    id: 's_clara',
    email: 'clara@aprende.mais',
    displayName: 'Clara Mendes',
    role: 'STUDENT',
    birthDate: '2015-01-22T00:00:00.000Z',
    createdAt: daysAgo(45),
  },
  {
    id: 's_joao',
    email: 'joao@aprende.mais',
    displayName: 'João Pereira',
    role: 'STUDENT',
    birthDate: '2014-07-30T00:00:00.000Z',
    createdAt: daysAgo(20),
  },
  {
    id: 's_lia',
    email: 'lia@aprende.mais',
    displayName: 'Lia Rocha',
    role: 'STUDENT',
    birthDate: '2016-11-08T00:00:00.000Z',
    createdAt: daysAgo(5),
  },
]

export const mockProfiles: Record<string, StudentProfileSummary> = {
  s_ana: {
    id: 'p_ana',
    userId: 's_ana',
    learningLevel: 2,
    accessibility: { fontSize: 'large', dyslexiaFriendlyFont: true },
    preferences: { prefersAudio: true, sessionLengthMin: 20 },
    notes: 'Responde bem a exercícios com imagens. Evitar textos longos sem pausa.',
  },
  s_marco: {
    id: 'p_marco',
    userId: 's_marco',
    learningLevel: 3,
    accessibility: { highContrast: true },
    preferences: { prefersAudio: false, sessionLengthMin: 30 },
    notes: null,
  },
  s_clara: {
    id: 'p_clara',
    userId: 's_clara',
    learningLevel: 1,
    accessibility: {},
    preferences: { prefersAudio: true, sessionLengthMin: 15 },
    notes: 'Iniciando a alfabetização. Avançar com paciência.',
  },
  s_joao: {
    id: 'p_joao',
    userId: 's_joao',
    learningLevel: 2,
    accessibility: { fontSize: 'medium' },
    preferences: {},
    notes: null,
  },
  s_lia: {
    id: 'p_lia',
    userId: 's_lia',
    learningLevel: 1,
    accessibility: {},
    preferences: {},
    notes: null,
  },
}

const rel = (
  id: string,
  teacherId: string,
  studentId: string,
  status: TeachingRelationshipStatus,
  daysInvited: number,
  extras: Partial<TeachingRelationship> = {},
): TeachingRelationship => ({
  id,
  teacherId,
  studentId,
  status,
  message: null,
  invitedAt: daysAgo(daysInvited),
  respondedAt: null,
  revokedAt: null,
  createdAt: daysAgo(daysInvited),
  updatedAt: daysAgo(daysInvited),
  ...extras,
})

export const mockRelationships: TeachingRelationship[] = [
  rel('r1', 't_paula', 's_ana', 'ACCEPTED', 60, {
    message: 'Vamos trabalhar leitura juntos!',
    respondedAt: daysAgo(59),
  }),
  rel('r2', 't_paula', 's_marco', 'ACCEPTED', 30, {
    message: 'Vamos começar com textos curtos.',
    respondedAt: daysAgo(29),
  }),
  rel('r3', 't_paula', 's_clara', 'PENDING', 2, {
    message: 'Oi Clara, podemos tentar aulas de leitura?',
  }),
  rel('r4', 't_paula', 's_joao', 'REVOKED_BY_TEACHER', 15, {
    revokedAt: daysAgo(10),
  }),
  rel('r5', 't_rui', 's_marco', 'DECLINED', 20, {
    respondedAt: daysAgo(19),
  }),
]

// ─── Subjects (islands in the student's journey) ───────────────────────
// status: AVAILABLE means the student can start a lesson there right now.
// LOCKED means not yet unlocked (placeholder — no exercises seeded).
// COMPLETED means the student finished it (with star rating 0–3).
export const mockSubjects: Subject[] = [
  {
    id: 'sub-cozinha',
    slug: 'cozinha',
    title: 'Cozinha',
    color: '#58cc02',
    iconKey: 'chef-hat',
    status: 'AVAILABLE',
    stars: 2,
    totalLessons: 6,
    orderIndex: 1,
  },
  {
    id: 'sub-rua',
    slug: 'rua',
    title: 'Rua',
    color: '#1cb0f6',
    iconKey: 'road',
    status: 'AVAILABLE',
    stars: 0,
    totalLessons: 5,
    orderIndex: 2,
  },
  {
    id: 'sub-escola',
    slug: 'escola',
    title: 'Escola',
    color: '#ce82ff',
    iconKey: 'school',
    status: 'AVAILABLE',
    stars: 0,
    totalLessons: 5,
    orderIndex: 3,
  },
  {
    id: 'sub-casa',
    slug: 'casa',
    title: 'Casa',
    color: '#ff9600',
    iconKey: 'home',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 4,
  },
  {
    id: 'sub-dinheiro',
    slug: 'dinheiro',
    title: 'Dinheiro',
    color: '#ffc800',
    iconKey: 'coin',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 5,
  },
  {
    id: 'sub-comida',
    slug: 'comida',
    title: 'Comida',
    color: '#ff4b4b',
    iconKey: 'food',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 6,
  },
  {
    id: 'sub-corpo',
    slug: 'corpo',
    title: 'Corpo e saúde',
    color: '#14c38e',
    iconKey: 'body',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 7,
  },
  {
    id: 'sub-transporte',
    slug: 'transporte',
    title: 'Transporte',
    color: '#7b61ff',
    iconKey: 'bus',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 8,
  },
  {
    id: 'sub-tempo',
    slug: 'tempo',
    title: 'Tempo',
    color: '#00c2c7',
    iconKey: 'weather',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 9,
  },
  {
    id: 'sub-animais',
    slug: 'animais',
    title: 'Animais',
    color: '#ff86d0',
    iconKey: 'paw',
    status: 'LOCKED',
    stars: 0,
    totalLessons: 0,
    orderIndex: 10,
  },
]

// ─── Exercise pool ──────────────────────────────────────────────────────
// Each subject that's AVAILABLE has 5+ exercises. The lesson generator
// will pick 5 from the subject's pool at random when a lesson starts.

export const mockExercises: Exercise[] = [
  // ─── Cozinha (6) ───
  {
    id: 'ex-coz-1',
    subjectId: 'sub-cozinha',
    prompt: 'Panela quente no fogão',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Sua mãe pediu para você pegar a panela quente que está no fogão.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'bare-hands',
          text: 'Pego com as mãos',
          consequence: 'Cuidado! A panela está muito quente. Você pode se queimar.',
          correct: false,
        },
        {
          id: 'cloth',
          text: 'Uso um pano de prato ou luva',
          consequence: 'Boa! O pano protege sua mão do calor.',
          correct: true,
        },
        {
          id: 'wait',
          text: 'Espero esfriar e pego depois',
          consequence: 'Também funciona, mas demora. Se a comida precisa ser servida agora, peça ajuda.',
          correct: true,
        },
      ],
    },
  },
  {
    id: 'ex-coz-2',
    subjectId: 'sub-cozinha',
    prompt: 'Faca afiada na bancada',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você quer cortar uma maçã e vê uma faca afiada na bancada.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'grab-by-blade',
          text: 'Pego a faca pelo fio',
          consequence: 'Cuidado! Pegar pelo fio corta o dedo.',
          correct: false,
        },
        {
          id: 'grab-by-handle',
          text: 'Pego a faca pelo cabo',
          consequence: 'Isso! O cabo é a parte segura para segurar.',
          correct: true,
        },
        {
          id: 'play',
          text: 'Brinco com a faca como espada',
          consequence: 'Faca é ferramenta, não brinquedo.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-coz-3',
    subjectId: 'sub-cozinha',
    prompt: 'Cheiro de gás na cozinha',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você entra na cozinha e sente um cheiro forte de gás.',
      question: 'O que você faz primeiro?',
      choices: [
        {
          id: 'light-match',
          text: 'Acendo um fósforo para ver melhor',
          consequence: 'NUNCA! Gás com fogo pode explodir.',
          correct: false,
        },
        {
          id: 'open-window',
          text: 'Abro a janela e saio da cozinha',
          consequence: 'Isso! Arejar e sair é o mais seguro.',
          correct: true,
        },
        {
          id: 'turn-on-light',
          text: 'Acendo a luz para enxergar',
          consequence: 'Cuidado! O interruptor pode soltar faísca e incendiar o gás.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-coz-4',
    subjectId: 'sub-cozinha',
    prompt: 'Aparelho elétrico molhado',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'O liquidificador caiu na pia com o fio dentro da água.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'grab-it',
          text: 'Pego rápido para tirar da água',
          consequence: 'NUNCA! Você pode levar um choque grave.',
          correct: false,
        },
        {
          id: 'unplug',
          text: 'Peço a um adulto para desligar o disjuntor primeiro',
          consequence: 'Perfeito! Desligar a energia primeiro remove o perigo.',
          correct: true,
        },
      ],
    },
  },
  {
    id: 'ex-coz-5',
    subjectId: 'sub-cozinha',
    prompt: 'Produto de limpeza com cheiro forte',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você quer ajudar a limpar e vê um produto embaixo da pia.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'drink',
          text: 'Bebo um pouquinho para ver se é bom',
          consequence: 'NUNCA beba produtos de limpeza! São veneno.',
          correct: false,
        },
        {
          id: 'mix-cleaners',
          text: 'Misturo dois produtos para ficar mais forte',
          consequence: 'Misturar pode soltar gases tóxicos.',
          correct: false,
        },
        {
          id: 'ask-adult',
          text: 'Peço a um adulto para me mostrar como usar',
          consequence: 'Isso! Produtos de limpeza são perigosos.',
          correct: true,
        },
      ],
    },
  },
  {
    id: 'ex-coz-6',
    subjectId: 'sub-cozinha',
    prompt: 'Pequeno incêndio na frigideira',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'A frigideira no fogão pegou fogo.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'water',
          text: 'Jogo água para apagar',
          consequence: 'NUNCA jogue água em fogo de óleo! Explode.',
          correct: false,
        },
        {
          id: 'lid',
          text: 'Coloco uma tampa sobre a frigideira',
          consequence: 'Isso! Tampar abafa o fogo cortando o ar.',
          correct: true,
        },
        {
          id: 'run',
          text: 'Saio correndo e deixo a cozinha',
          consequence: 'Sair é seguro, mas o fogo pode se espalhar.',
          correct: false,
        },
      ],
    },
  },

  // ─── Rua (6) ───
  {
    id: 'ex-rua-1',
    subjectId: 'sub-rua',
    prompt: 'Atravessando a rua',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você está na calçada e quer atravessar a rua para ir à padaria.',
      question: 'O que você faz primeiro?',
      choices: [
        {
          id: 'run',
          text: 'Atravesso correndo para ser rápido',
          consequence: 'Correr na rua é perigoso. Você pode tropeçar.',
          correct: false,
        },
        {
          id: 'crosswalk',
          text: 'Procuro a faixa de pedestres e espero o sinal',
          consequence: 'Isso! Sempre use a faixa e respeite o sinal.',
          correct: true,
        },
        {
          id: 'between-cars',
          text: 'Atravesso entre dois carros parados',
          consequence: 'O carro pode arrancar a qualquer momento.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-rua-2',
    subjectId: 'sub-rua',
    prompt: 'Pessoa estranha oferecendo doce',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Na saída da escola, um adulto que você não conhece oferece um doce.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'accept',
          text: 'Aceito, parece legal',
          consequence: 'Nunca aceite nada de estranhos, mesmo que pareça simpático.',
          correct: false,
        },
        {
          id: 'say-no-walk',
          text: 'Digo "não, obrigado" e vou embora',
          consequence: 'Isso! Diga não e se afaste. Conte a um adulto de confiança.',
          correct: true,
        },
        {
          id: 'go-closer',
          text: 'Me aproximo para ver melhor',
          consequence: 'Nunca se aproxime de um estranho.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-rua-3',
    subjectId: 'sub-rua',
    prompt: 'Perdido na rua',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você se distraiu e não encontra mais seus pais na rua.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'wander',
          text: 'Continuo andando procurando sozinho',
          consequence: 'Andar procurando pode te levar para mais longe.',
          correct: false,
        },
        {
          id: 'stay-put',
          text: 'Fico parado no mesmo lugar e peço ajuda',
          consequence: 'Perfeito! Fique onde seus pais possam te encontrar.',
          correct: true,
        },
        {
          id: 'stranger-car',
          text: 'Aceito carona de um estranho',
          consequence: 'NUNCA. Vá a um adulto seguro ou peça ajuda em uma loja.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-rua-4',
    subjectId: 'sub-rua',
    prompt: 'Sinal vermelho para pedestres',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você está na faixa e o sinal fica vermelho.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'hurry',
          text: 'Atravesso rápido antes do carro chegar',
          consequence: 'Nunca! Carros podem aparecer muito rápido.',
          correct: false,
        },
        {
          id: 'wait',
          text: 'Espero o sinal abrir e atravesso',
          consequence: 'Isso! O sinal vermelho significa PARE.',
          correct: true,
        },
      ],
    },
  },
  {
    id: 'ex-rua-5',
    subjectId: 'sub-rua',
    prompt: 'Cachorro desconhecido na rua',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você vê um cachorro solto na calçada sem dono por perto.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'pet',
          text: 'Vou fazer carinho no cachorro',
          consequence: 'Cachorros soltos podem estar assustados ou doentes. Cuidado!',
          correct: false,
        },
        {
          id: 'keep-distance',
          text: 'Passo longe, sem me aproximar',
          consequence: 'Isso! Mantenha distância e avise um adulto.',
          correct: true,
        },
        {
          id: 'chase',
          text: 'Tento brincar de pega-pega com ele',
          consequence: 'NUNCA persiga um cachorro. Pode morder.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-rua-6',
    subjectId: 'sub-rua',
    prompt: 'Andar na calçada',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você está voltando da escola a pé pela calçada.',
      question: 'Qual é a forma mais segura de andar?',
      choices: [
        {
          id: 'road',
          text: 'Ando no meio da rua para ver os carros',
          consequence: 'A rua é dos carros. Sempre ande na calçada.',
          correct: false,
        },
        {
          id: 'sidewalk-far',
          text: 'Ando na calçada, longe da rua',
          consequence: 'Isso! Mantenha-se afastado da rua.',
          correct: true,
        },
        {
          id: 'phone',
          text: 'Ando na calçada olhando o celular',
          consequence: 'Andar distraído pode fazer você tropeçar ou cair na rua.',
          correct: false,
        },
      ],
    },
  },

  // ─── Escola (5) ───
  {
    id: 'ex-esc-1',
    subjectId: 'sub-escola',
    prompt: 'Pedir ajuda ao professor',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você está na aula e não entendeu a matéria.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'skip',
          text: 'Fico quieto e não pergunto nada',
          consequence: 'Não entender e ficar quieto só piora. Pergunte!',
          correct: false,
        },
        {
          id: 'ask-teacher',
          text: 'Levanto a mão e peço ajuda ao professor',
          consequence: 'Isso! Professores estão lá para ajudar.',
          correct: true,
        },
        {
          id: 'copy',
          text: 'Copia do colega sem entender',
          consequence: 'Copiar sem entender não ajuda a aprender.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-esc-2',
    subjectId: 'sub-escola',
    prompt: 'Colega fazendo bullying',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Um colega fica pegando seu lanche toda semana e rindo de você.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'suffer',
          text: 'Fico quieto para não piorar a situação',
          consequence: 'Bullying não melhora sozinho. Conte para um adulto.',
          correct: false,
        },
        {
          id: 'tell',
          text: 'Conto para um professor ou meus pais',
          consequence: 'Isso! Bullying não é culpa sua. Peça ajuda.',
          correct: true,
        },
        {
          id: 'revenge',
          text: 'Pego o lanche dele de volta',
          consequence: 'Revidar não resolve. Converse com um adulto.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-esc-3',
    subjectId: 'sub-escola',
    prompt: 'Acidente no recreio',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'Você cai no pátio e está com o joelho sangrando.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'hide',
          text: 'Levanto e escondo para ninguém ver',
          consequence: 'Feridas precisam ser limpas. Procure ajuda sempre.',
          correct: false,
        },
        {
          id: 'nurse',
          text: 'Vou até a enfermeira ou um professor',
          consequence: 'Isso! Adultos vão cuidar do ferimento.',
          correct: true,
        },
        {
          id: 'continue',
          text: 'Continuo brincando e espero parar sozinho',
          consequence: 'Ferimentos podem infeccionar. Sempre peça ajuda.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-esc-4',
    subjectId: 'sub-escola',
    prompt: 'Tropeço na mochila',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'No corredor da escola, você tropeça em uma mochila deixada no chão.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'kick',
          text: 'Chuto a mochila para o lado',
          consequence: 'A mochila tem coisas do dono. Avise o dono ou um professor.',
          correct: false,
        },
        {
          id: 'pick-up',
          text: 'Pego a mochila e entrego ao dono ou à secretaria',
          consequence: 'Isso! Devolver é gentil e seguro.',
          correct: true,
        },
        {
          id: 'leave',
          text: 'Deixo no chão e sigo andando',
          consequence: 'Alguém pode tropeçar. É melhor mover para um lugar seguro.',
          correct: false,
        },
      ],
    },
  },
  {
    id: 'ex-esc-5',
    subjectId: 'sub-escola',
    prompt: 'Não sabe onde é a sala',
    payload: {
      type: 'MULTIPLE_CHOICE',
      scenario: 'É seu primeiro dia e você não acha a sala de aula.',
      question: 'O que você faz?',
      choices: [
        {
          id: 'wander',
          text: 'Continuo andando sozinho tentando achar',
          consequence: 'Pode te levar para lugares errados.',
          correct: false,
        },
        {
          id: 'ask-staff',
          text: 'Pergunto a um funcionário ou aluno mais velho',
          consequence: 'Isso! Pedir ajuda é o jeito certo.',
          correct: true,
        },
        {
          id: 'skip-class',
          text: 'Vou embora da escola',
          consequence: 'Nunca saia da escola sem avisar. Conte a um adulto.',
          correct: false,
        },
      ],
    },
  },
]

// ─── Illustration assets ──────────────────────────────────────────────────
// Attach `imageUrl` / `scenarioImageUrl` / `consequenceImageUrl` to every
// exercise by mapping the IDs the image-prompts.json file uses. URLs point to
// /images/exercises/<id>.png (Vite serves /public at the root).
//
// If you ran scripts/generate-images.mjs with --only ex-coz-1, every other
// exercise's imageUrl will simply 404 at runtime — the UI is built to
// gracefully fall back to text-only rendering when the image is missing.
const img = (id: string) => `/images/exercises/${id}.png`
for (const exercise of mockExercises) {
  const exId = exercise.id
  if (exercise.payload.scenario !== undefined) {
    exercise.payload.scenarioImageUrl = img(`${exId}-scenario`)
  }
  for (const choice of exercise.payload.choices) {
    choice.imageUrl = img(`${exId}-choice-${choice.id}`)
    choice.consequenceImageUrl = img(`${exId}-consequence-${choice.id}`)
  }
}

// ─── Lesson history for Ana (some completed, one in progress) ────────
// Status per exercise reflects what the student actually did:
//   CORRECT            → got it right first try
//   FAILED_THEN_CORRECT → got it wrong, then answered correctly on retry
//   PENDING             → still working on it
export const mockLessons: Lesson[] = [
  {
    id: 'les-1',
    studentId: 's_ana',
    subjectId: 'sub-cozinha',
    subjectTitle: 'Cozinha',
    subjectColor: '#58cc02',
    status: 'COMPLETED',
    score: 100,
    totalCount: 5,
    startedAt: daysAgo(14),
    completedAt: daysAgo(14),
    exercises: [
      { id: 'le-1', exerciseId: 'ex-coz-1', orderIndex: 0, status: 'CORRECT', chosenChoiceId: 'cloth' },
      { id: 'le-2', exerciseId: 'ex-coz-2', orderIndex: 1, status: 'CORRECT', chosenChoiceId: 'grab-by-handle' },
      { id: 'le-3', exerciseId: 'ex-coz-3', orderIndex: 2, status: 'CORRECT', chosenChoiceId: 'open-window' },
      { id: 'le-4', exerciseId: 'ex-coz-4', orderIndex: 3, status: 'CORRECT', chosenChoiceId: 'unplug' },
      { id: 'le-5', exerciseId: 'ex-coz-5', orderIndex: 4, status: 'CORRECT', chosenChoiceId: 'ask-adult' },
    ],
  },
  {
    id: 'les-2',
    studentId: 's_ana',
    subjectId: 'sub-cozinha',
    subjectTitle: 'Cozinha',
    subjectColor: '#58cc02',
    status: 'COMPLETED',
    score: 80,
    totalCount: 5,
    startedAt: daysAgo(11),
    completedAt: daysAgo(11),
    exercises: [
      { id: 'le-6', exerciseId: 'ex-coz-6', orderIndex: 0, status: 'CORRECT', chosenChoiceId: 'lid' },
      { id: 'le-7', exerciseId: 'ex-coz-1', orderIndex: 1, status: 'CORRECT', chosenChoiceId: 'cloth' },
      { id: 'le-8', exerciseId: 'ex-coz-2', orderIndex: 2, status: 'FAILED_THEN_CORRECT', chosenChoiceId: 'grab-by-blade' },
      { id: 'le-9', exerciseId: 'ex-coz-3', orderIndex: 3, status: 'CORRECT', chosenChoiceId: 'open-window' },
      { id: 'le-10', exerciseId: 'ex-coz-4', orderIndex: 4, status: 'CORRECT', chosenChoiceId: 'unplug' },
    ],
  },
  {
    id: 'les-3',
    studentId: 's_ana',
    subjectId: 'sub-cozinha',
    subjectTitle: 'Cozinha',
    subjectColor: '#58cc02',
    status: 'COMPLETED',
    score: 60,
    totalCount: 5,
    startedAt: daysAgo(8),
    completedAt: daysAgo(8),
    exercises: [
      { id: 'le-21', exerciseId: 'ex-coz-1', orderIndex: 0, status: 'CORRECT', chosenChoiceId: 'cloth' },
      { id: 'le-22', exerciseId: 'ex-coz-2', orderIndex: 1, status: 'FAILED_THEN_CORRECT', chosenChoiceId: 'play' },
      { id: 'le-23', exerciseId: 'ex-coz-3', orderIndex: 2, status: 'FAILED_THEN_CORRECT', chosenChoiceId: 'light-match' },
      { id: 'le-24', exerciseId: 'ex-coz-4', orderIndex: 3, status: 'CORRECT', chosenChoiceId: 'unplug' },
      { id: 'le-25', exerciseId: 'ex-coz-5', orderIndex: 4, status: 'CORRECT', chosenChoiceId: 'ask-adult' },
    ],
  },
  {
    id: 'les-4',
    studentId: 's_ana',
    subjectId: 'sub-rua',
    subjectTitle: 'Rua',
    subjectColor: '#1cb0f6',
    status: 'COMPLETED',
    score: 100,
    totalCount: 5,
    startedAt: daysAgo(6),
    completedAt: daysAgo(6),
    exercises: [
      { id: 'le-11', exerciseId: 'ex-rua-1', orderIndex: 0, status: 'CORRECT', chosenChoiceId: 'say-no-walk' },
      { id: 'le-12', exerciseId: 'ex-rua-2', orderIndex: 1, status: 'CORRECT', chosenChoiceId: 'say-no-walk' },
      { id: 'le-13', exerciseId: 'ex-rua-3', orderIndex: 2, status: 'CORRECT', chosenChoiceId: 'stay-put' },
      { id: 'le-14', exerciseId: 'ex-rua-4', orderIndex: 3, status: 'CORRECT', chosenChoiceId: 'wait' },
      { id: 'le-15', exerciseId: 'ex-rua-5', orderIndex: 4, status: 'CORRECT', chosenChoiceId: 'crosswalk' },
    ],
  },
  {
    id: 'les-5',
    studentId: 's_ana',
    subjectId: 'sub-rua',
    subjectTitle: 'Rua',
    subjectColor: '#1cb0f6',
    status: 'COMPLETED',
    score: 80,
    totalCount: 5,
    startedAt: daysAgo(4),
    completedAt: daysAgo(4),
    exercises: [
      { id: 'le-26', exerciseId: 'ex-rua-1', orderIndex: 0, status: 'CORRECT', chosenChoiceId: 'say-no-walk' },
      { id: 'le-27', exerciseId: 'ex-rua-2', orderIndex: 1, status: 'CORRECT', chosenChoiceId: 'say-no-walk' },
      { id: 'le-28', exerciseId: 'ex-rua-3', orderIndex: 2, status: 'FAILED_THEN_CORRECT', chosenChoiceId: 'wander' },
      { id: 'le-29', exerciseId: 'ex-rua-4', orderIndex: 3, status: 'CORRECT', chosenChoiceId: 'wait' },
      { id: 'le-30', exerciseId: 'ex-rua-5', orderIndex: 4, status: 'CORRECT', chosenChoiceId: 'crosswalk' },
    ],
  },
  {
    id: 'les-6',
    studentId: 's_ana',
    subjectId: 'sub-escola',
    subjectTitle: 'Escola',
    subjectColor: '#ce82ff',
    status: 'COMPLETED',
    score: 60,
    totalCount: 5,
    startedAt: daysAgo(2),
    completedAt: daysAgo(2),
    exercises: [
      { id: 'le-31', exerciseId: 'ex-esc-1', orderIndex: 0, status: 'CORRECT', chosenChoiceId: 'sit' },
      { id: 'le-32', exerciseId: 'ex-esc-2', orderIndex: 1, status: 'FAILED_THEN_CORRECT', chosenChoiceId: 'suffer' },
      { id: 'le-33', exerciseId: 'ex-esc-3', orderIndex: 2, status: 'FAILED_THEN_CORRECT', chosenChoiceId: 'hide' },
      { id: 'le-34', exerciseId: 'ex-esc-4', orderIndex: 3, status: 'CORRECT', chosenChoiceId: 'ignore-walk' },
      { id: 'le-35', exerciseId: 'ex-esc-5', orderIndex: 4, status: 'CORRECT', chosenChoiceId: 'tell-adult' },
    ],
  },
  {
    id: 'les-7',
    studentId: 's_ana',
    subjectId: 'sub-rua',
    subjectTitle: 'Rua',
    subjectColor: '#1cb0f6',
    status: 'IN_PROGRESS',
    score: 0,
    totalCount: 5,
    startedAt: minutesAgo(20),
    completedAt: null,
    exercises: [
      { id: 'le-16', exerciseId: 'ex-rua-2', orderIndex: 0, status: 'CORRECT' },
      { id: 'le-17', exerciseId: 'ex-rua-1', orderIndex: 1, status: 'PENDING' },
      { id: 'le-18', exerciseId: 'ex-rua-4', orderIndex: 2, status: 'PENDING' },
      { id: 'le-19', exerciseId: 'ex-rua-3', orderIndex: 3, status: 'PENDING' },
      { id: 'le-20', exerciseId: 'ex-rua-6', orderIndex: 4, status: 'PENDING' },
    ],
  },
]

// ─── Lesson picker + state mutations (mocked equivalents of the backend) ──

function pickRandom<T>(arr: T[], n: number): T[] {
  const pool = [...arr]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}

let nextLessonNum = 100
let nextExerciseNum = 100

export function mockStartLesson(
  studentId: string,
  subjectId: string,
): { lesson: Lesson } | null {
  const subject = mockSubjects.find((s) => s.id === subjectId)
  if (!subject || subject.status === 'LOCKED') return null

  const pool = mockExercises.filter((e) => e.subjectId === subjectId)
  if (pool.length < 5) return null

  const picked = pickRandom(pool, 5)
  const lessonExercises = picked.map((ex, i) => ({
    id: `le-${nextExerciseNum++}`,
    exerciseId: ex.id,
    orderIndex: i,
    status: 'PENDING' as const,
  }))

  const lesson: Lesson = {
    id: `les-${nextLessonNum++}`,
    studentId,
    subjectId,
    subjectTitle: subject.title,
    subjectColor: subject.color,
    status: 'IN_PROGRESS',
    score: 0,
    totalCount: 5,
    startedAt: new Date().toISOString(),
    completedAt: null,
    exercises: lessonExercises,
  }

  mockLessons.unshift(lesson)
  return { lesson }
}

export function mockGetLesson(lessonId: string): Lesson | undefined {
  return mockLessons.find((l) => l.id === lessonId)
}

export interface MockAnswerResult {
  correct: boolean;
  status: 'CORRECT' | 'FAILED_THEN_CORRECT' | 'PENDING';
  consequence: string;
  correctChoiceText: string;
  lessonComplete: boolean;
  score: number;
}

export function mockSubmitAnswer(
  lessonId: string,
  lessonExerciseId: string,
  choiceId: string,
): MockAnswerResult | null {
  const lesson = mockLessons.find((l) => l.id === lessonId)
  if (!lesson || lesson.status === 'COMPLETED') return null

  const entry = lesson.exercises.find((e) => e.id === lessonExerciseId)
  if (!entry) return null

  const exercise = mockExercises.find((e) => e.id === entry.exerciseId)
  if (!exercise) return null

  const chosen = exercise.payload.choices.find((c) => c.id === choiceId)
  if (!chosen) return null

  const correctChoice = exercise.payload.choices.find((c) => c.correct)
  if (!correctChoice) return null

  const hadPriorAttempts = lesson.exercises.find((e) => e.id === lessonExerciseId)!
  const hadAttempts = entry.orderIndex !== undefined && (lesson.exercises.findIndex((e) => e.id === lessonExerciseId) >= 0)
  // The "had prior attempts" check is simpler in our mock: check the entry's stored state.
  // For mock purposes, we don't track raw attempts, only status.
  // A status of FAILED_THEN_CORRECT only happens if we previously marked it wrong.
  // We approximate: the entry's status flips to FAILED_THEN_CORRECT if it was previously non-PENDING and is now correct.
  void hadPriorAttempts
  void hadAttempts
  const previouslyResolved = entry.status !== 'PENDING'
  const newStatus: 'CORRECT' | 'FAILED_THEN_CORRECT' | 'PENDING' = chosen.correct
    ? previouslyResolved
      ? 'FAILED_THEN_CORRECT'
      : 'CORRECT'
    : 'PENDING'

  entry.status = newStatus
  entry.chosenChoiceId = choiceId

  const open = lesson.exercises.filter((e) => e.status === 'PENDING').length
  let lessonComplete = false
  let score = lesson.score

  if (open === 0) {
    const correctCount = lesson.exercises.filter(
      (e) => e.status === 'CORRECT' || e.status === 'FAILED_THEN_CORRECT',
    ).length
    score = Math.round((correctCount / lesson.totalCount) * 100)
    lesson.status = 'COMPLETED'
    lesson.completedAt = new Date().toISOString()
    lesson.score = score
    lessonComplete = true

    // Update subject stars (3 if 100%, 2 if ≥75%, 1 if ≥50%, else 0)
    const subject = mockSubjects.find((s) => s.id === lesson.subjectId)
    if (subject) {
      const stars = score >= 100 ? 3 : score >= 75 ? 2 : score >= 50 ? 1 : 0
      if (stars > subject.stars) subject.stars = stars as 0 | 1 | 2 | 3
      subject.status = 'COMPLETED'
    }
  } else if (chosen.correct && !previouslyResolved) {
    score = lesson.score + 1
    lesson.score = score
  }

  return {
    correct: chosen.correct,
    status: newStatus,
    consequence: chosen.consequence,
    correctChoiceText: correctChoice.text,
    lessonComplete,
    score,
  }
}

// ─── Lookup helpers ─────────────────────────────────────────────────────

export function getUserById(id: string): UserSummary | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getProfileByStudentId(studentId: string): StudentProfileSummary | undefined {
  return mockProfiles[studentId]
}

export function getRelationshipsForTeacher(teacherId: string): TeachingRelationship[] {
  return mockRelationships.filter((r) => r.teacherId === teacherId)
}

export function searchStudents(query: string): UserSummary[] {
  const q = query.trim().toLowerCase()
  if (!q) return mockUsers.filter((u) => u.role === 'STUDENT')
  return mockUsers.filter(
    (u) =>
      u.role === 'STUDENT' &&
      (u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
  )
}

export function getSubjectsForStudent(_studentId: string): Subject[] {
  // For mock purposes, all students see the same journey.
  return [...mockSubjects].sort((a, b) => a.orderIndex - b.orderIndex)
}

export function getSubjectById(id: string): Subject | undefined {
  return mockSubjects.find((s) => s.id === id)
}

export function getExercisesForSubject(subjectId: string): Exercise[] {
  return mockExercises.filter((e) => e.subjectId === subjectId)
}

export function getExerciseById(exerciseId: string): Exercise | undefined {
  return mockExercises.find((e) => e.id === exerciseId)
}

export function getLessonsForStudent(studentId: string): Lesson[] {
  return mockLessons
    .filter((l) => l.studentId === studentId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}
