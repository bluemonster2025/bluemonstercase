// Tipos base (reutilizáveis)
export interface RawImage {
  sourceUrl: string;
  altText?: string;
}

// --- Estrutura vinda da API (igual ao GraphQL atual) ---
export interface RawNotificationBar {
  notificationOnoff: boolean;
  notificationMesssage: string;
}

export interface RawNotificacao {
  notificationBar?: RawNotificationBar;
}

export interface RawConfiguracoesDoSite {
  notificacao?: RawNotificacao;
}

// --- Tipo final mapeado (simplificado para uso no front) ---
export interface siteConfig {
  /** Indica se a barra de notificação está ativa */
  notificationEnabled: boolean;
  /** Mensagem exibida na barra */
  notificationMessage?: string;
}
