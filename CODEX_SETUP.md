# Setup Codex plan B - FlexRoyale

Ce fichier sert a utiliser ChatGPT/Codex comme plan B quand Claude Cowork n'a plus de credits, perd le contexte, ou qu'il faut verifier/reprendre localement.

Claude Cowork reste le flux principal. Codex ne remplace pas Claude : il doit reprendre uniquement a partir de `AGENTS.md`, `TASKS.md` et des derniers textes colles par l'utilisateur.

## 1. Connecter GitHub
Dans ChatGPT/Codex :

1. Ouvrir les parametres d'environnement.
2. Connecter GitHub avec OAuth.
3. Autoriser le repo `ark0s1/flexroyale`.
4. Selectionner la branche `main`.

Le GitHub PAT n'est pas necessaire si Codex utilise OAuth.

## 2. Setup script Codex
Coller ce script dans le setup script de l'environnement Codex :

```bash
#!/usr/bin/env bash
set -euo pipefail

npm install -g vercel
cd /repo
npm install

echo "export VERCEL_TOKEN=${VERCEL_TOKEN}" >> ~/.bashrc
echo "export UPSTASH_REDIS_REST_URL=${UPSTASH_REDIS_REST_URL}" >> ~/.bashrc
echo "export UPSTASH_REDIS_REST_TOKEN=${UPSTASH_REDIS_REST_TOKEN}" >> ~/.bashrc
```

## 3. Secrets Codex
Ajouter ces secrets dans Codex, sans les ecrire dans le repo :

- `VERCEL_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## 4. Variables Codex
Ajouter cette variable :

```text
NEXT_PUBLIC_PROXY_URL=https://cr-proxy-flexroyale.fly.dev
```

## 5. Internet
Activer l'acces internet de l'agent Codex pour permettre :

- `npm install`
- les appels Vercel
- les verifications externes si necessaire

## 6. Premier prompt a donner a Codex
```text
Tu es le plan B Codex pour FlexRoyale. Claude Cowork reste le flux principal.
Lis AGENTS.md puis TASKS.md avant toute action.
Tout changement doit respecter la regle anti-regression.
Inspecte le worktree avant de modifier quoi que ce soit, car Claude peut avoir laisse un chantier local non commit.

Tache :
[decrire ici ce que tu veux faire]
```

## Note securite
Si un token a deja ete partage en clair dans un chat ou un fichier, il vaut mieux le regenerer ensuite dans le dashboard concerne.
