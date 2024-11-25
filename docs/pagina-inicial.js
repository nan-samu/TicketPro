document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:5000/api/chamados/status');
        const data = await response.json();

        // Inicializa um objeto com contagens zeradas
        const statusCounts = {
            'Novo': 0,
            'Em atendimento': 0,
            'Pendente': 0,
            'Solucionado': 0,
            'Excluído': 0
        };

        // Atualiza o objeto com os valores do banco de dados
        data.forEach(status => {
            statusCounts[status._id] = status.count;
        });

        // Atualiza os elementos HTML com as contagens
        document.querySelectorAll('.status-item1').forEach(item => {
            const statusText = item.querySelector('span').innerText.trim();
            const countElement = item.querySelector('.status-count1');
            countElement.innerText = statusCounts[statusText] || 0;
        });
    } catch (error) {
        console.error('Erro ao carregar status dos chamados:', error);
    }
});
