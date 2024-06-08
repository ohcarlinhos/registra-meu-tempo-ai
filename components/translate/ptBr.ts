export default {
  v: {
    required: "Obrigatório.",
    email: {
      format: "Digite um e-mail válido.",
      required: "E-mail é obrigatório.",
    },
    user: {
      name: {
        required: "Nome é obrigatório.",
        min: "Nome deve possuir pelo menos 3 caractéres.",
        max: "Nome tem o tamanho máximo de 120 caractéres.",
      },
      password: {
        required: "Senha é obrigatório",
        min: "Senha deve possuir pelo menos 8 caractéres.",
        max: "Senha tem o tamanho máximo de 48 caractéres.",
      },
      confirmPassword: {
        required: "A confirmação da nova senha é obrigatória.",
        diff: "Senhas diferentes.",
      },
      oldPassword: {
        required: "Informe a senha antiga para criar uma nova senha.",
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
      newPassword: "Nova senha",
      confirmPassword: "Confirmação da senha",
      confirmNewPassword: "Confirmação da nova senha",
      oldPassword: "Senha antiga",
    },

    register: {
      access: "Acessar conta",
    },

    login: {
      title: "Acessar",
      success: "Autenticação feita com sucesso.",
      button: "Acessar",
      create: "Criar conta",
    },
  },

  api: {
    error: {
      generic:
        "Não foi possível realizar essa ação, espere alguns minutos e tente novamente.",
    },
  },

  goToHome: "Ir para página inicial",
};
