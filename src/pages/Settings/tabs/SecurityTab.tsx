import React, { useState } from 'react';
import { KeyRound, Shield, ShieldCheck, History, Key, AlertTriangle } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Button } from '../../../components/ui/Button/Button';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

export const SecurityTab: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Segurança</h2>

      <SettingSection title="Autenticação">
        <SettingRow label="Alterar senha" description="Atualize sua senha regularmente">
          <Button variant="secondary" size="sm" leftIcon={<KeyRound size={14} />} onClick={() => setShowChangePassword(true)}>Alterar</Button>
        </SettingRow>
        <SettingRow label="Autenticação em 2 fatores (2FA)" description="Proteja sua conta com verificação adicional">
          <Switch checked={twoFactor} onChange={(v) => {
            if (v) setShowTwoFactor(true);
            setTwoFactor(v);
          }} />
        </SettingRow>
        <SettingRow label="Códigos de recuperação" description="Gere códigos de backup para acesso de emergência">
          <Button variant="ghost" size="sm" leftIcon={<Key size={14} />} onClick={() => setShowTwoFactor(true)}>Gerar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Monitoramento">
        <SettingRow label="Alertas de login" description="Receba alertas quando houver login em novo dispositivo">
          <Switch checked={loginAlerts} onChange={setLoginAlerts} />
        </SettingRow>
        <SettingRow label="Histórico de acessos" description="Veja todos os acessos recentes à sua conta">
          <Button variant="ghost" size="sm" leftIcon={<History size={14} />} onClick={() => setShowSessions(true)}>Ver histórico</Button>
        </SettingRow>
        <SettingRow label="Atividade da conta" description="Log detalhado de ações na conta">
          <Button variant="ghost" size="sm" leftIcon={<History size={14} />} onClick={() => setShowSessions(true)}>Ver atividade</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Chaves e Dispositivos">
        <SettingRow label="Dispositivos confiáveis" description="Gerencie dispositivos que não precisam de 2FA">
          <Button variant="ghost" size="sm" leftIcon={<ShieldCheck size={14} />} onClick={() => setShowSessions(true)}>Gerenciar</Button>
        </SettingRow>
        <SettingRow label="Chaves de segurança" description="Use chaves físicas como U2F/FIDO2">
          <Button variant="ghost" size="sm" leftIcon={<Key size={14} />} disabled>Configurar</Button>
        </SettingRow>
      </SettingSection>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      {/* Mocks for other requested modals */}
      {showTwoFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Configurar 2FA</h3>
            <div className="bg-surface-hover p-4 rounded-lg flex justify-center mb-4">
              {/* Dummy QR Code */}
              <div className="w-48 h-48 bg-white p-2">
                <div className="w-full h-full border-4 border-black border-dashed flex items-center justify-center text-black font-bold text-center">QR CODE<br/>(Simulado)</div>
              </div>
            </div>
            <p className="text-sm text-text-muted mb-4">Escaneie o código com seu app autenticador. Como isso é um ambiente de demonstração, sua configuração será apenas salva localmente.</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowTwoFactor(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => { setTwoFactor(true); setShowTwoFactor(false); }}>Concluir</Button>
            </div>
          </div>
        </div>
      )}
      
      {showSessions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Histórico de Acessos</h3>
            <p className="text-sm text-text-muted mb-4">Abaixo estão os registros recentes (Acesse a aba "Dispositivos" para gerenciar sessões reais).</p>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              <div className="p-3 bg-surface-hover rounded-lg border border-border flex justify-between items-center">
                <div>
                  <p className="font-semibold text-text">Windows • Chrome</p>
                  <p className="text-xs text-success">Sessão Atual</p>
                </div>
                <span className="text-xs text-text-muted">Agora mesmo</span>
              </div>
              <div className="p-3 bg-surface-hover rounded-lg border border-border flex justify-between items-center opacity-70">
                <div>
                  <p className="font-semibold text-text">iPhone • Safari</p>
                  <p className="text-xs text-text-muted">Rio de Janeiro, BR</p>
                </div>
                <span className="text-xs text-text-muted">Ontem, 14:30</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowSessions(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
