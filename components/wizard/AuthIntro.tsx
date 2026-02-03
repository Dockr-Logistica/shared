import React from 'react';

export function AuthIntro() {
  return (
    <div className="text-white max-w-md">
      <h1 className="text-4xl font-bold mb-6">
        Bem-vindo ao Dockr
      </h1>
      <p className="text-xl text-white/90 mb-8">
        A plataforma que conecta embarcadores e transportadoras de forma simples e eficiente.
      </p>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm">✓</span>
          </div>
          <span>Cotações em tempo real</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm">✓</span>
          </div>
          <span>Rastreamento completo</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm">✓</span>
          </div>
          <span>Pagamento seguro</span>
        </li>
      </ul>
    </div>
  );
}