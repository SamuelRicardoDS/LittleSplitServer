# Escopo do Rachadinha

### Aplicação para controle de despesas entre amigos com:

* “rolês” (sessões de gastos) dentro do grupo;
* convite de usuários, amizade, grupos;
* registro de despesas com regra de divisão (**default**: divisão igual para todos do grupo, **exclusiva**: apenas o criador arca com essa despesa ou **específica**: divisão por participantes e proporções);
* fechamento do rolê com cálculo de quem deve/recebe;
* saldos que carregam para o próximo rolê;
* integração com gateway de pagamento para acerto entre usuários.

### Regras de negócio essenciais
* Amizade: precisa ser recíproca (pedido → aceite).
* Participação no grupo: só admin convida/remove.
* Rolê (sessão): estados RASCUNHO → ABERTO → ENCERRADO → LIQUIDADO. Apenas ABERTO aceita despesas.
* Despesa: tem criador, valor, data, descrição, categoria, participantes (opcional) e “exclusiva” (boolean).
    * Se exclusiva=true → 100% do criador.
    * Se específica informados → divide proporcionalmente entre usuários selecionados
    * Se nada informado → (default) todos do grupo no momento do lançamento vão pagar igualmente pela despesa.
* Fechamento do rolê: calcula o saldo de cada participante (deve/recebe) considerando:
    * todas as despesas do rolê;
    * saldo carregado de rolês anteriores no mesmo grupo.
* Liquidação: o sistema sugere transferências mínimas para zerar os débitos (algoritmo de min cash-flow).
* Saldo acumulado por grupo: após registrar quem pagou no fechamento, atualiza SaldoPorGrupo (pode ficar + ou - para o próximo rolê).
* Pagamento: cartões são tokenizados no gateway; transferências P2P registram TransacaoPagamento com webhooks para confirmar.
* Arredondamento: 2 casas decimais (BRL). Diferenças de centavos vão para o maior credor por ordem determinística (ex.: ID).
* Permissões: só membro do grupo vê/lança no grupo; só admin encerra rolê; qualquer membro pode pagar sua parte no acerto.

## US-001 — Criar conta e logar

`Como visitante quero criar conta e logar para usar o app.`

#### Critérios de aceite:

`Dado email não cadastrado, quando me registro, então recebo verificação. Login com email+senha.`

## US-002 — Convidar amigos por email

`Como usuário quero convidar amigos para que entrem no app.`

#### Critérios de aceite:

`Convite gera token com expiração. Convite aparece para o convidado ao criar conta.`

## US-003 — Solicitação/aceite de amizade

`Como usuário quero enviar e aceitar amizade para habilitar grupos.`

#### Critérios de aceite:

Pedidos pendentes listados.

Amizade precisa de aceite recíproco.

## US-004 — Criar grupo e definir admin

`Como usuário quero criar grupo para organizar despesas por turma.`

#### Critérios de aceite:

Criador vira admin.

Nome e descrição obrigatórios.

## US-005 — Adicionar/remover membros no grupo

`Como admin quero gerenciar membros para manter o grupo correto.`

#### Critérios de aceite:

Adição só de amigos.

Remoção bloqueada se houver rolê em ABERTO.

## US-006 — Ver saldos por grupo

`Como membro quero ver meu saldo acumulado no grupo para saber se entro positivo/negativo.`

#### Critérios de aceite:

Mostra saldo total e por rolê anterior.

## US-007 — Abrir um rolê

`Como admin quero abrir rolê para registrar despesas daquele encontro.`

#### Critérios de aceite:

Estado vai para ABERTO.

Data/hora de início e título.

## US-008 — Lançar despesa

`Como membro quero lançar despesa para registrar gastos do rolê.`

#### Critérios de aceite:

Valor > 0, criador, categoria, descrição.

Regras de divisão (exclusiva / participantes / todos).

Persistência de quem pagou a conta (pagador inicial).

## US-009 — Editar/Excluir despesa (enquanto ABERTO)

`Como criador ou admin quero corrigir despesa para manter dados confiáveis.`

#### Critérios de aceite:

Log de auditoria (quem editou/quando).

Não permite se rolê ENCERRADO.

Should | 3 pts

## US-010 — Encerrar rolê e calcular acerto

Como admin quero encerrar o rolê para ver quem deve pagar/receber.

#### Critérios de aceite:

Considera saldo acumulado anterior.

Gera “plano de repasses” mínimo (lista de quem paga → quem recebe, valores).

Estado → ENCERRADO.

Must | 8 pts

## US-011 — Registrar pagamentos do acerto

Como membro quero registrar pagamentos para liquidar o rolê.

#### Critérios de aceite:

Registrar pagamentos parciais e múltiplas transações.

Quando todos os nets forem zerados (± R$0,01 tolerância), estado → LIQUIDADO.

Must | 5 pts

## US-012 — Carregar saldo para próximo rolê

Como sistema quero carregar saldo para iniciar próximo rolê com valores positivos/negativos.

#### Critérios de aceite:

Após LIQUIDADO, atualiza SaldoPorGrupo.

Próximo rolê inicia com esses saldos.

Must | 3 pts

Épico D — Pagamentos (Gateway)

## US-013 — Cadastrar cartão no gateway

Como usuário quero tokenizar meu cartão para poder pagar com segurança.

#### Critérios de aceite:

Nenhum dado sensível salvo localmente (só token).

Validação e erro claro do gateway.

Must | 5 pts

## US-014 — Pagar acerto pelo gateway

Como usuário quero pagar minha parte para quitar com o recebedor.

#### Critérios de aceite:

Cria TransacaoPagamento com status (PENDENTE, APROVADO, FALHOU).

Webhook de confirmação atualiza saldos/liquidação automaticamente.

Should | 8 pts

## US-015 — Histórico e recibos

Como membro quero ver histórico de rolês, despesas, pagamentos para auditoria.

#### Critérios de aceite:

Filtros por período, export CSV/PDF (opcional).

Link para transação no gateway.

Could | 3 pts

## Requisitos não-funcionais (NFRs)

- Segurança: tokens de cartão (PCI via gateway), HTTPS obrigatório, bcrypt/argon2 para senhas, RBAC por recurso.
- Disponibilidade: 99% (trabalho acadêmico) e idempotência em webhooks.
- Escalabilidade: cálculos locais por rolê; queries paginadas; índices por grupo/rolê.
- Observabilidade: logs estruturados; trilha de auditoria de despesas/pagamentos.
- Usabilidade: mobile-first; feedbacks claros em erros do gateway.
- Localização: BRL, timezone America/Sao_Paulo.

## Modelo de domínio (principais entidades)

**Usuario**(id, nome, email, status, createdAt)
**Amizade**(id, solicitanteId, solicitadoId, status)
**Grupo**(id, nome, descricao, adminId, createdAt)
**ParticipanteGrupo**(id, grupoId, usuarioId, papel[ADMIN|MEMBRO], status)
**SaldoPorGrupo**(id, grupoId, usuarioId, saldoAtual)
**RoleSessao**(id, grupoId, titulo, estado[RASCUNHO|ABERTO|ENCERRADO|LIQUIDADO], inicio, fim)
**Despesa**(id, roleId, criadorId, pagadorId, valorTotal, categoria, descricao, exclusiva:bool)
**ParcelaDespesa**(id, despesaId, usuarioId, peso, valorCalculado)
**PlanoRepasse**(id, roleId, deUsuarioId, paraUsuarioId, valor, status[SUGERIDO|PAGO_PARCIAL|PAGO|CANCELADO])
**CartaoToken**(id, usuarioId, gateway, token, apelido, ultimos4)
**TransacaoPagamento**(id, planoRepasseId?, deUsuarioId, paraUsuarioId, valor, gateway, status, externalRef, criadoEm, confirmadoEm)
**Convite**(id, email, convidanteId, token, expiraEm, status)

