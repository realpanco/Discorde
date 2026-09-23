import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Button } from '../../../components/ui/Button/Button';
import { ExternalLink, HelpCircle, MessageSquare, Flag, FileText, Heart, Info } from 'lucide-react';

export const SupportTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Suporte</h2>

      <SettingSection title="Ajuda">
        <SettingRow label="Central de ajuda" description="Artigos e guias de uso">
          <Button variant="ghost" size="sm" leftIcon={<ExternalLink size={14} />}>Abrir</Button>
        </SettingRow>
        <SettingRow label="FAQ" description="Perguntas frequentes">
          <Button variant="ghost" size="sm" leftIcon={<HelpCircle size={14} />}>Ver FAQ</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Reportar">
        <SettingRow label="Reportar problema" description="Encontrou um bug? Nos avise!">
          <Button variant="secondary" size="sm" leftIcon={<Flag size={14} />}>Reportar</Button>
        </SettingRow>
        <SettingRow label="Reportar usuário" description="Denunciar comportamento inadequado">
          <Button variant="secondary" size="sm" leftIcon={<Flag size={14} />}>Reportar</Button>
        </SettingRow>
        <SettingRow label="Feedback" description="Envie suas sugestões e opiniões">
          <Button variant="ghost" size="sm" leftIcon={<MessageSquare size={14} />}>Enviar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Status">
        <SettingRow label="Status do serviço" description="Verifique se todos os serviços estão operacionais">
          <Button variant="ghost" size="sm" leftIcon={<ExternalLink size={14} />}>Verificar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Legal">
        <SettingRow label="Termos de serviço" description="Leia nossos termos de uso">
          <Button variant="ghost" size="sm" leftIcon={<FileText size={14} />}>Abrir</Button>
        </SettingRow>
        <SettingRow label="Política de privacidade" description="Como tratamos seus dados">
          <Button variant="ghost" size="sm" leftIcon={<FileText size={14} />}>Abrir</Button>
        </SettingRow>
        <SettingRow label="Licenças" description="Licenças de software de terceiros">
          <Button variant="ghost" size="sm" leftIcon={<FileText size={14} />}>Abrir</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Sobre">
        <SettingRow label="Sobre o aplicativo" description="Discord2 v2.0.0-beta">
          <Button variant="ghost" size="sm" leftIcon={<Info size={14} />}>Detalhes</Button>
        </SettingRow>
        <SettingRow label="Feito com" description="React, TypeScript, Socket.IO">
          <Heart size={16} className="text-danger" />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
