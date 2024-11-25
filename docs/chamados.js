document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('http://localhost:5000/api/chamados'); // URL da sua API
        const chamados = await response.json();

        // Seleciona o elemento da lista onde os chamados serão inseridos
        const chamadosList = document.getElementById('chamados-list');

        // Se não houver chamados, exibe uma mensagem
        if (chamados.length === 0) {
            chamadosList.innerHTML = '<p>Não há chamados registrados.</p>';
        } else {
            // Cria a lista de chamados
            chamados.forEach(chamado => {
                const listItem = document.createElement('div');
                listItem.classList.add('chamado-item');

                listItem.innerHTML = `
                    <div class="chamado-header">
                        <h3>${chamado.titulo}</h3>
                        <span class="chamado-status">${chamado.status}</span>
                    </div>
                    <div class="chamado-description">
                        <p>${chamado.descricao || 'Sem descrição.'}</p>
                    </div>
                    <div class="chamado-footer">
                        <span>Data de criação: ${new Date(chamado.dataCriacao).toLocaleDateString()}</span>
                        <button class="editar-btn" onclick="editarChamado('${chamado._id}')">Editar</button>
                        <button class="excluir-btn" onclick="excluirChamado('${chamado._id}')">Excluir</button>
                    </div>
                `;

                chamadosList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar os chamados:', error);
    }
});

// Função para redirecionar para a página de edição com o ID do chamado
function editarChamado(id) {
    window.location.href = `editar-chamado.html?id=${id}`;
}

// Função para excluir o chamado do banco de dados
async function excluirChamado(id) {
    const confirmacao = confirm('Você tem certeza que deseja excluir este chamado?');

    if (confirmacao) {
        try {
            const response = await fetch(`http://localhost:5000/api/chamados/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Chamado excluído com sucesso!');
                // Remove o chamado da lista sem recarregar a página
                const item = document.getElementById(id);
                if (item) item.remove();
            } else {
                alert('Erro ao excluir o chamado.');
            }
        } catch (error) {
            console.error('Erro ao excluir o chamado:', error);
            alert('Erro ao excluir o chamado.');
        }
    }
}
