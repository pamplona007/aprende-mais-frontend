const ptBR = {
  common: {
    appName: 'Aprende+',
    loading: 'Carregando...',
  },

  nav: {
    login: 'Entrar',
    register: 'Cadastrar',
    logout: 'Sair',
    home: 'Início',
  },

  user: {
    roleLabels: {
      STUDENT: 'Aluno',
      GUARDIAN: 'Responsável',
      TEACHER: 'Professor',
      ADMIN: 'Administrador',
    },
  },

  home: {
    hero: 'Uma plataforma de aprendizagem para crianças com dificuldades de aprendizado.',
    ctaLogin: 'Entrar',
    ctaRegister: 'Cadastrar',
  },

  auth: {
    loginTitle: 'Entre na sua conta',
    registerTitle: 'Crie sua conta',
    emailLabel: 'E-mail',
    passwordLabel: 'Senha',
    submitLogin: 'Entrar',
    submitRegister: 'Cadastrar',
    invalidCredentials: 'E-mail ou senha incorretos. Use uma das credenciais de demonstração abaixo.',
    newHere: 'Ainda não tem conta?',
    createAccount: 'Criar uma conta',
    alreadyHaveAccount: 'Já tem conta?',
    signIn: 'Entrar',
    demoHint: 'Credenciais de demonstração (clique para preencher):',
    teacher: 'Professor',
    student: 'Aluno',
    registerComingSoon: 'Cadastros em breve',
    registerComingSoonBody:
      'Para esta demonstração, use uma das contas de demonstração na página de login.',
    goToLogin: 'Ir para o login →',
  },

  validation: {
    emailRequired: 'E-mail é obrigatório',
    emailInvalid: 'Digite um e-mail válido',
    passwordRequired: 'Senha é obrigatória',
  },

  teacherDashboard: {
    crumbsHome: 'Início',
    crumbsArea: 'Área do professor',
    inviteStudent: '+ Convidar aluno',
    tabs: {
      active: 'Ativos',
      pending: 'Pendentes',
      past: 'Encerrados',
    },
    empty: {
      noActive: 'Nenhum aluno ativo ainda',
      noActiveBody: 'Quando um aluno aceitar seu convite, ele aparecerá aqui.',
      noPending: 'Nenhum convite pendente',
      noPendingBody: 'Envie um convite para trazer um aluno.',
      noPast: 'Nenhum relacionamento encerrado ainda',
      noPastBody: 'Convites recusados ou revogados aparecerão aqui.',
    },
    statusMeta: {
      invitedAgo: 'Convidado(a) há {{time}}',
      activeSince: 'Ativo(a) desde {{time}}',
    },
    pastReasons: {
      DECLINED: 'aluno recusou o convite',
      REVOKED_BY_TEACHER: 'você cancelou',
      REVOKED_BY_STUDENT: 'aluno cancelou',
    },
    teacherNotFound: 'Professor não encontrado',
    pickAnother: 'Escolha um professor na página inicial.',
    goHome: 'Ir para o início',
  },

  studentProfile: {
    crumbsHome: 'Início',
    yearsOld: 'anos',
    sections: {
      learningProfile: 'Perfil de aprendizagem',
      teacherNotes: 'Observações do professor',
      relationship: 'Relacionamento',
    },
    cards: {
      level: 'Nível',
      levelHint: 'Quanto maior, mais avançado',
      accessibility: 'Acessibilidade',
      preferences: 'Preferências',
    },
    noneSet: 'Nenhuma configuração',
    relMeta: {
      invited: 'Convidado(a) em {{date}}',
      responded: '· Respondeu em {{date}}',
      ended: '· Encerrado em {{date}}',
    },
    inviteMessage: 'Mensagem do convite:',
    backToDashboard: '← Voltar ao painel',
    studentNotFound: 'Aluno não encontrado',
    historyTitle: 'Histórico do aluno',
    historyEmpty: 'O aluno ainda não terminou nenhuma lição.',
    historyCount: '{{count}} lição(ões) concluída(s)',
    noHistory: 'Sem lições registradas ainda.',
  },

  inviteStudent: {
    crumbsHome: 'Início',
    crumbsArea: 'Área do professor',
    title: 'Convidar um aluno',
    subtitle: 'Procure um aluno pelo nome ou e-mail e envie um convite.',
    findLabel: 'Buscar aluno',
    findPlaceholder: 'Digite um nome ou e-mail...',
    empty: {
      noMatches: 'Nenhum aluno encontrado',
      noMatchesBody:
        'Ou ninguém corresponde à sua busca, ou todos os alunos já têm um relacionamento aberto com você.',
    },
    sendTo: 'Enviar convite para {{name}}',
    messageLabel: 'Mensagem (opcional)',
    messagePlaceholder: 'Diga olá e explique como você gostaria de ajudar...',
    send: 'Enviar convite',
    cancel: 'Cancelar',
    teacherNotFound: 'Professor não encontrado',
    inviteSentMock: 'Convite enviado para {{name}}{{message}} (demonstração)',
    inviteSentWithMessage: ' com a mensagem: "{{message}}"',
  },

  studentDashboard: {
    crumbsHome: 'Início',
    crumbsArea: 'Área do aluno',
    hello: 'Olá, {{name}} 👋',
    subtitle: 'Sua jornada de aprendizado.',
    backHome: '← Voltar ao início',
    notFound: 'Aluno não encontrado',
    journey: {
      startHint: 'Toque em uma ilha para começar',
      lockedTooltip: 'Disponível em breve',
      availableTooltip: 'Pronto para começar',
      completedTooltip: 'Você completou! Toque para refazer',
      starsLabel: 'estrelas',
    },
  },

  lessonPlayer: {
    progress: '{{current}} de {{total}}',
    continue: 'Continuar',
    tryAgain: 'Tentar de novo',
    next: 'Próxima',
    finish: 'Concluir',
    correctTitle: 'Muito bem!',
    wrongTitle: 'Quase!',
    correctFeedback: 'Você acertou!',
    wrongFeedback: 'Tente novamente com cuidado.',
    theRightAnswer: 'A resposta certa era:',
    completeTitle: 'Lição concluída!',
    completeBody: 'Você terminou todas as atividades.',
    scoreLabel: 'Pontuação',
    starsEarned: 'Você ganhou {{count}} estrelas!',
    backToJourney: 'Voltar para a jornada',
    exitLesson: 'Sair',
    confirmExit: 'Tem certeza que quer sair? Seu progresso será perdido.',
  },

  studentHistory: {
    title: 'Histórico',
    empty: 'Nenhuma lição concluída ainda.',
    completedAt: 'Concluída em {{date}}',
    exercises: '{{count}} exercícios',
    score: '{{score}}%',
    stars: {
      one: '1 estrela',
      other: '{{count}} estrelas',
      zero: 'Nenhuma estrela',
    },
  },

  register: {},

  status: {
    PENDING: 'Pendente',
    ACCEPTED: 'Ativo',
    DECLINED: 'Recusado',
    REVOKED_BY_TEACHER: 'Cancelado',
    REVOKED_BY_STUDENT: 'Revogado',
  },

  errors: {
    generic: 'Algo deu errado. Tente novamente.',
    notFound: 'Não encontrado',
  },
} as const

export default ptBR
export type Translations = typeof ptBR
