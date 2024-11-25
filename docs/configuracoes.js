document.getElementById('config-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }

    // Simulação de atualização no backend
    console.log(`Usuário atualizado para: ${username}`);
    console.log('Senha alterada com sucesso!');

    alert('Informações atualizadas com sucesso!');
    // Redirecionar ou realizar outras ações
});
