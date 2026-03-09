# Rosanurse

Plataforma de leitura de exames laboratoriais para médicos e profissionais de saúde.

## Sobre

Rosanurse é uma aplicação web **100% frontend** — sem backend. O usuário cola o texto copiado do PDF diretamente na aplicação. O parser extrai os exames e gera uma saída compacta, pronta para colar no prontuário.

**Formato de saída:**
```
HEMOGRAMA COMPLETO (Eritrograma: ..., Leucograma: ..., Plaquetas: ...) | VITAMINA D: 25,0 ng/mL | GLICOSE: 73,0 mg/dL | ...
```

## Stack

- **Next.js 16** + TypeScript
- **Tailwind CSS v4**

## Funcionalidades

- [x] Colar texto copiado do PDF e gerar saída compacta
- [x] Suporte ao formato MENA Diagnóstico
- [ ] Anamnese *(em breve)*
- [ ] Consulta *(em breve)*

## Comandos

| Comando | Descrição |
|---|---|
| `make install` | Instala as dependências |
| `make dev` | Inicia o servidor de desenvolvimento (`localhost:3000`) |
| `make build` | Gera o build de produção (pasta `out/`) |
| `make start` | Serve o build de produção com `npx serve` |
| `make clean` | Remove `node_modules`, `.next` e `out/` |

## Desenvolvimento

```bash
make dev
```

Acesse em `http://localhost:3000`.
