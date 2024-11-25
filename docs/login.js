document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-login').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('bt-email').value;
        const senha = document.getElementById('bt-senha').value;

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Erro ao fazer login');
            } else {
                // Armazenar o token no localStorage
                localStorage.setItem('token', data.token);

                // Redirecionar para a página principal ou dashboard
                window.location.href = '/docs/pagina-inicial.html';
            }
        } catch (err) {
            console.log(err);
            alert('Erro ao tentar fazer login');
        }
    });
});
