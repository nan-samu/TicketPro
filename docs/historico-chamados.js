// Suponhamos que você tenha os dados dos chamados em um array JSON
const chamados = [
    { id: 12345, status: 'Novo', data: '15/11/2024' },
    { id: 12346, status: 'Em Atendimento', data: '14/11/2024' },
    { id: 12347, status: 'Solucionado', data: '12/11/2024' },
    { id: 12348, status: 'Pendente', data: '10/11/2024' },
];

// Função para exibir os chamados na página
function exibirChamados() {
    const container = document.getElementById('historico-chamados');
    container.innerHTML = ''; // Limpa a área onde os chamados serão exibidos

    chamados.forEach(chamado => {
        const chamadoDiv = document.createElement('div');
        chamadoDiv.classList.add('chamado-item');

        const chamadoId = document.createElement('span');
        chamadoId.classList.add('chamado-id');
        chamadoId.textContent = `#${chamado.id}`;

        const chamadoStatus = document.createElement('span');
        chamadoStatus.classList.add('chamado-status');
        chamadoStatus.textContent = chamado.status;

        const chamadoData = document.createElement('span');
        chamadoData.classList.add('chamado-data');
        chamadoData.textContent = chamado.data;

        const detalhesBtn = document.createElement('a');
        detalhesBtn.classList.add('detalhes-btn');
        detalhesBtn.href = `detalhes-chamado.html?id=${chamado.id}`;
        detalhesBtn.textContent = 'Ver Detalhes';

        chamadoDiv.appendChild(chamadoId);
        chamadoDiv.appendChild(chamadoStatus);
        chamadoDiv.appendChild(chamadoData);
        chamadoDiv.appendChild(detalhesBtn);

        container.appendChild(chamadoDiv);
    });
}

// Chama a função para exibir os chamados
window.onload = exibirChamados;
