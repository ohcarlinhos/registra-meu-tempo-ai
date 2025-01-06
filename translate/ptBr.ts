const i18nObj = {
  appTitle: "Registra meu tempo aí! - Gerenciador de Tempo",
  infos: "Informações",
  add: "Adicionar",
  send: "Enviar",
  save: "Salvar",
  update: "Atualizar",
  cancel: "Cancelar",
  confirm: "Confirmar",
  clear: "Limpar",
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
  codeFormDescription:
    'Utilize o campo para identificar sua tarefa ou atividade. Ex: "TASK-1234".',
  category: "Categoria",
  categories: "Categorias",
  description: "Descrição",
  period: "Período",
  periods: "Períodos",
  required: "Obrigatório",
  record: "Registro",
  records: "Registros",
  toRecovery: "Recuperar",
  toRecord: "Registrar",
  name: "Nome",
  email: "Email",
  emailInUse:
    "E-mail em uso, forneça um e-mail diferente ou tente recuperar sua senha.",
  password: "Senha",
  oldPassword: "Senha antiga",
  goToHome: "Ir para Página Inicial",
  itemsPerPage: "Por página",
  options: "Opções",
  exit: "Sair",

  bind: "Vincular",

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
  break: "Descanso",
  minutes: "Minutos",

  sync: "Sincronizar",
  title: "Título",

  confirmDeleteCategoryMessage: "Tem certeza deseja excluir essa categoria?",
  confirmDeleteTimeRecordMessage:
    'Tem certeza deseja excluir a tarefa "{title}"?',
  confirmDeleteLocalRecordMessage:
    "Tem certeza que deseja excluir esse registro de tempo local?",
  confirmDeleteTimePeriodMessage: "Tem certeza que quer excluir esse período?",

  localRecordObs1:
    "Sessões de tempo locais são salvos em seu dispositivo (navegador) e não contabilizam nos resumos diários e estatísticas.",

  localRecordObs2:
    "Acesse ou crie uma conta para persistir ou vincula-las a uma tarefa.",

  codeIsWrong: "O código digitado é diferente do esperado.",
  codeIsRequired: "É obrigatório digitar o código.",

  confirmCodeToDeleteRecord: "Confirme o código para apagar a tarefa:",

  noPeriodRecorded: "Nenhum período registrado.",
  recordNotFound: "Tarefa não encontrado.",
  backToRecordList: "Voltar para Tarefas",
  emptyRecordDescription: "Nenhuma descrição fornecida para a tarefa.",
  pomodoro: "Pomodoro",
  pomodoros: "Pomodoros",

  startOfPeriod: "Início do período",
  endOfPeriod: "Fim do período",

  noTitle: "Sem título",

  timers: "Cronômetros",

  checkYourEmailInbox: "Verifique sua caixa de entrada.",

  recoveryPasswordSuccess:
    "E-mail de recuperação enviado, verifique a caixa de SPAM caso não esteja nas caixas principais.",

  successPeriodSync: "Períodos sincronizados com sucesso.",
  errorPeriodSync:
    "Não foi possível sincronizar com sua tarefa, porem seu tempo foi salvo localmente (navegador).",

  createAccount: "Criar conta",
  recoveryPassword: "Recuperar senha",

  userNotFound: "Usuário não encontrado.",

  emailIsInvalid: "Digite um e-mail válido.",
  emailIsRequired: "E-mail é obrigatório.",
  nameIsRequired: "Nome é obrigatório.",
  nameMin: "Nome deve possuir pelo menos 3 caracteres.",
  nameMax: "Nome tem o tamanho máximo de 120 caracteres.",
  passwordIsRequired: "Senha é obrigatório.",
  passwordMin: "Senha deve possuir pelo menos 8 caracteres.",
  passwordMax: "Senha tem o tamanho máximo de 48 caracteres.",
  passwordNeedANumber: "Senha deve possuir pelo menos um número.",
  passwordNeedASymbol: "Senha deve conter pelo menos um símbolo.",
  passwordNeedAUpper: "Senha deve possuir pelo menos uma letra maiúscula.",
  passwordNeedALow: "Senha deve possuir pelo menos uma letra minúscula.",
  confirmPasswordIsRequired: "A confirmação da nova senha é obrigatória.",
  confirmPasswordIsDifferent: "Senhas diferentes.",
  oldPasswordIsRequired: "Informe a senha antiga para criar uma nova senha.",

  userDate: "Dados do Usuário",
  updateUserSuccess: "Usuário atualizado com sucesso.",
  updateUserSuccessAndLogin:
    "Usuário atualizado com sucesso, acesse sua conta novamente utilizando seu novo e-mail.",
  createUserSuccess: "Usuário criado com sucesso.",
  loginSuccess: "Autenticação feita com sucesso.",
  login: "Acessar",
  createTimeRecordSuccess: "Terefa criada com sucesso.",
  updateTimeRecordSuccess: "Terefa atualizada com sucesso.",

  deleteTimePeriodSuccess: "Período excluído com sucesso.",
  createTimePeriodSuccess: "Período criado com sucesso.",
  updateTimePeriodSuccess: "Período atualizado com sucesso.",

  historyRecord: "Histórico",
  timerType: "Cronômetro",

  timerLabel01: "Bota pra rodar!",
  timerLabel02: "1, 2, 3 e...",
  timerLabel03: "Começar!",
  timerLabel04: "Bora?",
  timerLabel05: "Vamo trem!",

  howDoYouPrefereSaveRecord: "Como deseja salvar seu tempo?",
  saveOnBrowser: "Salvar no Navegador",
  saveOnAccount: "Salvar em Minha Conta",

  updatePasswordSuccess: "Senha atualizada com sucesso",
  wrongEmailOrPassword: "E-mail ou senha incorretos.",
  invalidRecoveryCode: "Código de recuperação inválido ou expirado.",
  sendRecoveryError: "Não possível enviar o email de recuperação de senha.",

  apiGenericError:
    "Não foi possível realizar essa ação, espere alguns minutos e tente novamente.",
  sessionExpiredError: "Sessão expirada, efetue um novo login.",
  genericError: "Não foi possível executar essa ação.",
} as const;

export type i18nT = keyof typeof i18nObj;
export default i18nObj;
