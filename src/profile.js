import React, { useState, useEffect } from 'react';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Aqui seria a sua requisição para pegar os dados do usuário
    setTimeout(() => {
      const data = { nome: 'João Silva', email: 'joao@email.com' };
      setUserData(data);
      setLoading(false);
    }, 2000); // Simula 2 segundos de carregamento
  }, []);

  return (
    <div className="profile">
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="user-info">
          <div className="user-avatar">
            {userData?.nome.charAt(0).toUpperCase()}
          </div>
          <div className="user-name">{userData?.nome}</div>
          <div className="user-email">{userData?.email}</div>
        </div>
      )}
    </div>
  );
}

export default Profile;
