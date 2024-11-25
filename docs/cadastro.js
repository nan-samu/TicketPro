document.getElementById('form-cad').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usuario = document.getElementById('bt-usu2').value;
    const email = document.getElementById('bt-email').value;
    const senha = document.getElementById('bt-senha2').value;

    try {
        const response = await fetch('http://localhost:5000/api/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Erro ao cadastrar usuário');
        } else {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';  // Redireciona para a tela de login
        }
    } catch (err) {
        console.log(err);
        alert('Erro ao tentar cadastrar usuário');
    }
});
