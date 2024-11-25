// Função para enviar os dados do formulário para o backend
    document.getElementById('enviar-chamado-btn').addEventListener('click', function(e) {
        e.preventDefault();

        // Capturar os dados do formulário
        const urgencia = document.getElementById('urgencia').value;
        const tipo = document.getElementById('tipo').value;
        const categoria = document.getElementById('categoria').value;
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;

        // Verificar se os campos obrigatórios foram preenchidos
        if (!titulo || !descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Enviar os dados para o backend via POST
        fetch('http://localhost:5000/criar-chamado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urgencia,
                tipo,
                categoria,
                titulo,
                descricao,
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Exibe a resposta de sucesso
            // Limpar o formulário após enviar
            document.getElementById('urgencia').value = '';
            document.getElementById('tipo').value = '';
            document.getElementById('categoria').value = '';
            document.getElementById('titulo').value = '';
            document.getElementById('descricao').value = '';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao criar o chamado.');
        });
    });
