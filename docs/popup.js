document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const userAvatar = document.getElementById("user-avatar");
    const logoutBtn = document.getElementById("logout-btn");
    const changeInfoBtn = document.getElementById("change-info-btn");

    // Mostrar pop-up ao clicar no avatar
    userAvatar.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    // Fechar pop-up ao clicar fora
    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    // Lógica para encerrar sessão
    logoutBtn.addEventListener("click", () => {
        alert("Sessão encerrada!");
        window.location.href = "login.html";
    });

    // Lógica para alterar informações
    changeInfoBtn.addEventListener("click", () => {
        window.location.href = "configuracoes.html";
    });
});
