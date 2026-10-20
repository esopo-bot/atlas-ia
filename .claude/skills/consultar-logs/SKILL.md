---
name: consultar-logs
description: Consulta o CloudWatch Logs Insights pelo aws CLI e devolve o resultado em colunas, com a janela de tempo calculada. Use quando o pedido for ler, filtrar ou contar logs da AWS ("o que deu erro na lambda nas últimas 2 h?", log group, Logs Insights, CloudWatch).
---

# Consultar logs

Um comando faz o `start-query`, espera até `Complete` e extrai em colunas. Precisa do `aws` com credencial (a
desta máquina: perfil padrão ou `AWS_PROFILE`) e de Node 18 ou mais novo. Sem Node: plano B, abaixo. Sem `aws`:
avise em uma linha e pare.

## Uso

```bash
MSYS_NO_PATHCONV=1 node <pasta desta skill>/scripts/consultar.mjs --grupo /aws/lambda/<função> \
  --regiao <região> --consulta 'fields @timestamp, @message | filter @message like /erro/ | limit 20' --desde 2h
```

- `--desde`: duração para trás (`30m`, `2h`, `1d`), epoch em segundos ou ISO 8601. `--ate`: `agora` se omitido.
- `--json` troca as colunas por JSON. `--teto` (60 s) sobe a espera em janela larga.
- Grupo, região e consulta entram sempre por argumento. Valor de cliente não mora no script.
- `MSYS_NO_PATHCONV=1` só no Git Bash: sem ele, `/aws/lambda/x` chega como `C:/Program Files/Git/aws/lambda/x`, e
  o script recusa. Com ele, o caminho do script vai relativo ou em `X:/...`: `/x/...` deixa de ser traduzido.
  Barra dobrada não serve: `//aws/...` chega dobrado.

## Três armadilhas

1. **`--cli-read-timeout` em toda chamada** (`--tempo-de-leitura`, 120 s): sem ele o `aws` desiste de ler antes de
   o Insights responder, e a consulta parece muda quando só está lenta.
2. **Janela calculada, não digitada.** O fuso escrito vale; sem fuso, UTC. Hora lida no fuso errado recorta a
   janela sem aviso: o vazio não prova ausência.
3. **Alias repetido no `parse`**: alias que repete outro `parse`, ou com o nome de um campo do `fields`, cala o
   original sem erro. O script avisa em stderr e segue.

`stats` e `fields` saem iguais em colunas, sem o `@ptr`.

## Plano B: à mão, no Git Bash

```bash
export MSYS_NO_PATHCONV=1
ate=$(date -u +%s); desde=$((ate - 2*3600))     # 2 h; de ISO: date -u -d '2026-09-01T08:00:00-03:00' +%s
id=$(aws logs start-query --region "$REGIAO" --cli-read-timeout 120 --log-group-name "$GRUPO" \
  --start-time "$desde" --end-time "$ate" --query-string '<consulta>' --query queryId --output text | tr -d '\r')
aws logs get-query-results --region "$REGIAO" --cli-read-timeout 120 --query-id "$id" --output json
```

Repita a última linha até `"status": "Complete"`; `Failed`, `Cancelled` ou `Timeout`: pare. O `date -d` sem fuso lê
hora local: escreva `Z` ou `-03:00`. Antes de disparar, confira o alias do `parse` (armadilha 3).

## Teste

`node <pasta desta skill>/scripts/consultar.test.mjs` roda as partes puras, sem `aws` nem rede.
