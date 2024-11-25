import React, { useState, useEffect } from 'react';

function Header() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const data = { nome: 'João Silva', email: 'joao@email.com' };
      setUserData(data);
      setLoading(false);
    }, 2000); // Simula 2 segundos de carregamento
  }, []);

  return (
    <div className="header">
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="user-info">
          <div className="user-avatar">
            {userData?.nome.charAt(0).toUpperCase()}
          </div>
          <div className="user-name">{userData?.nome}</div>
        </div>
      )}
    </div>
  );
}

export default Header;
