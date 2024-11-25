const express = require('express');
const app = express();
const userRoutes = require('./userRoutes');

app.use('/api', userRoutes); // Prefixa todas as rotas com '/api'

// Iniciar o servidor
app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});
