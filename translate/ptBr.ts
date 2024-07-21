export default {
  g: {
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
  },

  v: {
    required: "Obrigatório.",
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
        title: "Registrar",
        success: "Usuário criado com sucesso.",
        button: "Registrar",
      },

      update: {
        title: "Dados do Usuário",
        success: "Usuário atualizado com sucesso.",
        button: "Salvar",
      },

      name: "Nome",
      email: "Email",
      password: "Senha",
      registerCode: "Código de registro",
      newPassword: "Nova senha",
      confirmPassword: "Confirmação da senha",
      confirmNewPassword: "Confirmação da nova senha",
      oldPassword: "Senha antiga",
    },

    register: {
      access: "Acessar conta",
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
      title: "Acessar",
      success: "Autenticação feita com sucesso.",
      button: "Acessar",
      create: "Criar conta",
    },

    timeRecord: {
      code: "Código",
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

  time: {
    record: "Registro",
    recordList: "Registros",
    period: "Período",
    periodList: "Períodos",
  },

  timer: {
    title: {
      t1: "1, 2, 3 e...",
      t2: "Prontos?",
      t3: "Dá um start!",
    },
    buttons: {
      start: "Iniciar",
      continue: "Continuar",
      pause: "Pausar",
      finish: "Finalizar",
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

  goToHome: "Ir para Página Inicial",
};
