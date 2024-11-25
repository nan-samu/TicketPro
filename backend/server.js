const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Conectar ao MongoDB
const mongoURI = 'mongodb+srv://ticketUser:Qpalzm%402020@ticket-pro-cluster.lozrl.mongodb.net/?retryWrites=true&w=majority&appName=ticket-pro-cluster';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao banco de dados'))
    .catch(err => console.log(err));

// Definição do esquema do chamado
const chamadoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: String,
    urgencia: String,     // Adicionado
    tipo: String,         // Adicionado
    categoria: String,    // Adicionado
    status: { type: String, default: 'Novo' },
    dataCriacao: { type: Date, default: Date.now }
});

// Criando o modelo "Chamado"
const Chamado = mongoose.model('Chamado', chamadoSchema);

// Rota para buscar chamados
app.get('/api/chamados', async (req, res) => {
    try {
        const chamados = await Chamado.find();
        res.json(chamados);
    } catch (error) {
        console.error('Erro ao buscar chamados:', error);
        res.status(500).json({ message: 'Erro ao buscar chamados', error: error.message });
    }
});

// Endpoint para excluir um chamado
app.delete('/api/chamados/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Chamado.findByIdAndDelete(id);

        if (!resultado) {
            return res.status(404).json({ error: 'Chamado não encontrado.' });
        }

        res.status(200).json({ message: 'Chamado excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir o chamado:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota para editar um chamado
app.put('/api/chamados/:id', async (req, res) => {
    const { id } = req.params; // Pega o id do chamado na URL
    const { titulo, descricao, urgencia, tipo, categoria, status } = req.body; // Pega os dados do corpo da requisição

    try {
        // Tenta encontrar o chamado no banco e atualizá-lo
        const chamado = await Chamado.findByIdAndUpdate(id, {
            titulo,
            descricao,
            urgencia,
            tipo,
            categoria,
            status
        }, { new: true }); // A opção 'new: true' retorna o chamado atualizado

        if (!chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }

        // Se o chamado for encontrado e atualizado, retorna o chamado atualizado
        res.json({ message: 'Chamado atualizado com sucesso', chamado });
    } catch (error) {
        console.error('Erro ao atualizar chamado:', error);
        res.status(500).json({ message: 'Erro ao atualizar o chamado', error: error.message });
    }
});



// Rota para criar um novo chamado
app.post('/criar-chamado', async (req, res) => {
    try {
        const { urgencia, tipo, categoria, titulo, descricao } = req.body;

        // Criar um novo chamado com os dados recebidos
        const novoChamado = new Chamado({
            urgencia,
            tipo,
            categoria,
            titulo,
            descricao,
        });

        // Salvar o chamado no banco de dados
        await novoChamado.save();

        // Retornar uma resposta de sucesso
        res.status(201).json({ message: 'Chamado criado com sucesso', chamado: novoChamado });
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        res.status(500).json({ message: 'Erro ao criar chamado', error: error.message });
    }
});

// Definir o esquema do usuário
const UserSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});

// Criando o modelo "User"
const User = mongoose.model('User', UserSchema);

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token do header

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, 'seu_segredo', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        req.userId = decoded.userId; // Adiciona o userId à requisição
        next();
    });
};

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        const token = jwt.sign({ userId: user._id }, 'seu_segredo', { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, message: 'Login bem-sucedido!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

// Rota de cadastro
app.post('/api/cadastrar', async (req, res) => {
    const { usuario, email, senha } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const newUser = new User({ usuario, email, senha: senhaHash });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, 'seu_segredo', { expiresIn: '1h' });
        res.status(201).json({ token, userId: newUser._id, message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/chamados/status', async (req, res) => {
    try {
        const chamadosStatus = await Chamado.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        res.json(chamadosStatus);
    } catch (error) {
        console.error('Erro ao buscar status dos chamados:', error);
        res.status(500).json({ message: 'Erro ao buscar status dos chamados' });
    }
});


// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
