const i18nObj = {
  infos: "Informações",
  add: "Adicionar",
  send: "Enviar",
  save: "Salvar",
  cancel: "Cancelar",
  confirm: "Confirmar",
  start: "Início",
  end: "Fim",
  time: "Tempo",
  create: "Criar",
  delete: "Apagar",
  remove: "Remover",
  edit: "Editar",
  access: "Acessar",
  register: "Registrar",
  none: "Nenhum",
  date: "Data",
  code: "Código",
  category: "Categoria",
  categories: "Categorias",
  description: "Descrição",
  period: "Período",
  periods: "Períodos",
  required: "Obrigatório",
  record: "Registro",
  records: "Registros",
  toRecord: "Registrar",
  name: "Nome",
  email: "Email",
  password: "Senha",
  oldPassword: "Senha antiga",
  goToHome: "Ir para Página Inicial",
  itemsPerPage: "Por página",
  options: "Opções",
  exit: "Sair",

  registerCode: "Código de registro",
  newPassword: "Nova senha",
  confirmPassword: "Confirmação da senha",
  confirmNewPassword: "Confirmação da nova senha",
  externalLink: "Link externo",
  statistics: "Estatísticas",

  doStart: "Iniciar",
  continue: "Continuar",
  pause: "Pausar",
  finish: "Finalizar",
  stop: "Parar",

  sync: "Sincronizar",
  title: "Título",

  confirmDeleteCategoryMessage: "Tem certeza deseja excluir essa categoria?",
  confirmDeleteTimeRecordMessage: "Tem certeza deseja excluir esse registro?",
  confirmDeleteTimePeriodMessage: "Tem certeza que quer excluir esse período?",

  noPeriodRecorded: "Nenhum período registrado.",
  recordNotFound: "Registro não encontrado.",
  backToRecords: "Voltar para Registros",
  emptyRecordDescription: "Nenhuma descrição fornecida para o registro.",
  pomodoro: "Pomodoro",
  pomodoros: "Pomodoros",

  startOfPeriod: "Início do período",
  endOfPeriod: "Fim do período",

  noTitle: "Sem título",

  timers: "Cronômetros",

  checkYourEmailInbox: "Verifique sua caixa de entrada.",

  recoveryPasswordSuccess:
    "E-mail de recuperação enviado, verifique a caixa de SPAM caso não esteja nas caixas principais.",

  successPeriodSync: "Períodos de tempo sincronizados com sucesso.",
  errorPeriodSync:
    "Não foi possível sincronizar seu registro, porem seu tempo foi salvo localmente (navegador).",

  createAccount: "Criar conta",
  recoveryPassword: "Recuperar senha",

  userNotFound: "Usuário não encontrado.",

  v: {
    email: {
      format: "Digite um e-mail válido.",
      required: "E-mail é obrigatório.",
    },

    user: {
      name: {
        required: "Nome é obrigatório.",
        min: "Nome deve possuir pelo menos 3 caracteres.",
        max: "Nome tem o tamanho máximo de 120 caracteres.",
      },
      password: {
        required: "Senha é obrigatório",
        min: "Senha deve possuir pelo menos 8 caracteres.",
        max: "Senha tem o tamanho máximo de 48 caracteres.",
      },
      confirmPassword: {
        required: "A confirmação da nova senha é obrigatória.",
        diff: "Senhas diferentes.",
      },
      oldPassword: {
        required: "Informe a senha antiga para criar uma nova senha.",
      },
      registerCode: {
        required: "Código de registro obrigatório.",
      },
    },
  },

  form: {
    user: {
      create: {
        success: "Usuário criado com sucesso.",
      },

      update: {
        title: "Dados do Usuário",
        success: "Usuário atualizado com sucesso.",
        button: "Salvar",
      },
    },

    category: {
      create: {
        title: "Categoria",
        submit: "Criar",
      },
      update: {
        title: "Atualizar Categoria",
        submit: "Salvar",
      },
    },

    login: {
      success: "Autenticação feita com sucesso.",
      create: "Criar conta",
    },

    timeRecord: {
      code: "Código",
      title: "Título",
      description: "Descrição",
      date: "Data",
      category: "Categoria",
      selectCategoryAdd: "Criar:",
      status: {
        success: {
          create: "Registro criado com sucesso.",
          update: "Registro atualizado com sucesso.",
        },
      },
    },

    timePeriod: {
      status: {
        success: {
          create: "Período adicionado com sucesso.",
          update: "Período atualizado com sucesso.",
          delete: "Período excluído com sucesso.",
        },
      },
    },
  },

  timer: {
    title: {
      t1: "1, 2, 3 e...",
      t2: "Prontos?",
      t3: "Dá um start!",
    },
    persistModal: {
      text: "Como deseja salvar o Registro?",
      browserButton: "Salvar no Navegador",
      accountButton: "Salvar em Minha Conta",
    },
  },

  wrongEmailOrPassword: "E-mail ou senha incorretos.",

  apiGenericError:
    "Não foi possível realizar essa ação, espere alguns minutos e tente novamente.",
  apiBaseDoNotSet: "Variável API_BASE não definida.",
  sessionExpiredError: "Sessão expirada, efetue um novo login.",
  genericError: "Não foi possível executar essa ação.",
} as const;

export type i18nT = keyof typeof i18nObj;
export default i18nObj;
