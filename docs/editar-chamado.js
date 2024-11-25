document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idChamado = urlParams.get('id');

    if (idChamado) {
        try {
            // Buscar o chamado a ser editado
            const response = await fetch(`http://localhost:5000/api/chamados/${idChamado}`);
            const chamado = await response.json();

            // Preencher os campos do formulário com os dados do chamado
            document.getElementById('titulo').value = chamado.titulo;
            document.getElementById('descricao').value = chamado.descricao;
            document.getElementById('status').value = chamado.status;
        } catch (error) {
            console.error('Erro ao carregar os dados do chamado:', error);
        }
    }

    // Enviar os dados atualizados ao backend
    const form = document.getElementById('form-editar-chamado');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const updatedChamado = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            status: document.getElementById('status').value,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/chamados/${idChamado}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedChamado),
            });

            if (response.ok) {
                alert('Chamado atualizado com sucesso!');
                window.location.href = 'chamados.html';
            } else {
                alert('Erro ao atualizar o chamado.');
            }
        } catch (error) {
            console.error('Erro ao atualizar o chamado:', error);
            alert('Erro ao atualizar o chamado.');
        }
    });
});
