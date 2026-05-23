const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cadastro
const register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: "Nome, email e senha são obrigatórios",
      });
    }

    // Verifica usuário existente
    const { data: usuarioExistente } = await supabase
      .from("usuarios")
      .select("id_usuario, email")
      .eq("email", email)
      .single();

    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    // Criptografa senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Salva usuário
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nome,
          email,
          senha_hash: senhaHash,
        },
      ])
      .select(
        `
        id_usuario,
        nome,
        email,
        tipo_usuario,
        criado_em
      `
      );

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // Busca usuário
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha inválidos",
      });
    }

    // Verifica senha
    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha inválidos",
      });
    }

    // Gera token
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Perfil do usuário autenticado
const perfil = async (req, res, next) => {
  try {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id_usuario, nome, email, tipo_usuario, criado_em")
      .eq("id_usuario", req.usuario.id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  perfil,
};