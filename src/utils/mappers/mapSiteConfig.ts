import { RawConfiguracoesDoSite, siteConfig } from "@/types/siteConfig";

export function mapSiteConfig(raw?: RawConfiguracoesDoSite): siteConfig {
  const bar = raw?.notificacao?.notificationBar;

  return {
    notificationEnabled: !!bar?.notificationOnoff,
    notificationMessage: bar?.notificationMesssage || "",
  };
}
