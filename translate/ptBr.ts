export default {
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
  itemsPerPage: "Itens por página",

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
      period: {
        start: "Início do período",
        end: "Fim do período",
      },
      status: {
        success: {
          create: "Registro de tempo criado com sucesso.",
          update: "Registro de atualizado com sucesso.",
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
      text: "Como deseja salvar o Registro de Tempo?",
      browserButton: "Salvar no Navegador",
      accountButton: "Salvar em Minha Conta",
    },
  },

  api: {
    error: {
      generic:
        "Não foi possível realizar essa ação, espere alguns minutos e tente novamente.",
    },
  },
};
