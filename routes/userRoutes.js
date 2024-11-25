const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('./models/User');
const Chamado = require('./models/Chamado');

// Middleware para processar JSON no corpo da requisição
router.use(express.json());

fetch('http://localhost:5000/chamados', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,  // Passa o token no header Authorization
  }
})
.then(response => response.json())
.then(data => {
  console.log('Chamados:', data);
})
.catch(error => console.error('Erro:', error));

// Atualizar chamado
router.put('/api/chamados/:id', async (req, res) => {
    const { titulo, descricao, status } = req.body;
    try {
        const chamado = await Chamado.findByIdAndUpdate(req.params.id, {
            titulo,
            descricao,
            status,
        }, { new: true });

        if (!chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }

        res.json(chamado);
    } catch (error) {
        console.error('Erro ao atualizar chamado:', error);
        res.status(500).json({ message: 'Erro ao atualizar o chamado' });
    }
});



// Rota de cadastro de usuário
router.post('/cadastrar', async (req, res) => {
    const { email, senha, usuario } = req.body;

    if (!email || !senha || !usuario) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const userExistente = await User.findOne({ email });
        if (userExistente) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = new User({
            usuario,
            email,
            senha: senhaCriptografada,
        });

        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
});

router.get('/api/dashboard', async (req, res) => {
    try {
      // Agrupa os chamados por status e conta o total de cada
      const result = await Chamado.aggregate([
        { $group: { _id: '$status', total: { $sum: 1 } } }
      ]);
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar dados', error });
    }
  });
  


// Rota de login
router.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const db = req.app.locals.db;
        const query = 'SELECT * FROM usuarios WHERE usuario = $1';
        const result = await db.query(query, [usuario]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if (isPasswordValid) {
            res.status(200).json({ message: 'Login bem-sucedido!', userId: user.id });
        } else {
            res.status(401).json({ message: 'Senha incorreta' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

// Rota para criar chamado
router.post('/chamados', (req, res) => {
    const { urgencia, tipo, categoria, titulo, descricao } = req.body;

    if (!urgencia || !tipo || !categoria || !titulo || !descricao) {
        return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' });
    }

    const novoChamado = new Chamado({
        urgencia,
        tipo,
        categoria,
        titulo,
        descricao,
        status: 'Aberto',
        dataCriacao: new Date()
    });

    novoChamado.save()
        .then(() => {
            res.json({ success: true, message: 'Chamado criado com sucesso!' });
        })
        .catch(err => {
            console.error('Erro ao salvar o chamado:', err);
            res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
        });
});

module.exports = router;
