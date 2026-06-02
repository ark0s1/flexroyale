# FlexRoyale - AGENTS.md

## Contexte projet
FlexRoyale est une app Next.js 14 App Router (TypeScript, Tailwind) qui estime la valeur en euros d'un compte Clash Royale, genere une battle card par grade et affiche un leaderboard.

## Role de Codex
Codex est le plan B du projet, pas le remplacement du Claude Cowork.

- Flux principal : continuer a travailler avec Claude Cowork quand il est disponible.
- Flux secours : utiliser Codex quand Claude n'a plus de tokens, perd le contexte, ou quand une verification/build locale est utile ici.
- Avant toute action Codex : lire `AGENTS.md`, puis `TASKS.md`, puis inspecter le worktree. Ne jamais supposer que Claude a fini ou commit ses changements.
- Ne pas deployer, commit ou pousser sans demande claire si un chantier Claude est encore en cours.

- Local Windows : `C:\Users\ysanc\Downloads\flexroyale-rebuild`
- Live : https://flexroyale.vercel.app
- GitHub : https://github.com/ark0s1/flexroyale
- Branche principale : `main`
- Vercel project : `flexroyale`

## Stack
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Redis Upstash pour le leaderboard
- Proxy Clash Royale Fly.io : `https://cr-proxy-flexroyale.fly.dev/v1`
- Images PNG locales des grades dans `public/grades/`

## Variables et secrets
Ne jamais committer de token en clair.

Secrets attendus dans l'environnement Codex ou Vercel :
- `VERCEL_TOKEN`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Variable publique utile :
- `NEXT_PUBLIC_PROXY_URL=https://cr-proxy-flexroyale.fly.dev`

## Commandes Codex Linux
Dans Codex cloud, le repo est generalement clone dans `/repo`.

```bash
cd /repo
npm install
npm run build
```

Deploy Vercel :

```bash
cd /repo
vercel --prod --yes --token "$VERCEL_TOKEN"
```

Push Git :

```bash
cd /repo
git add .
git commit -m "description"
git push origin main
```

## Commandes locales Windows
Le shell local est PowerShell.

- Ne jamais utiliser `&&`; utiliser `;` ou des commandes separees.
- Pour les chemins contenant `[tag]`, toujours utiliser `-LiteralPath`.
- Pour les commandes longues, rediriger stdout/stderr dans des fichiers puis relire par morceaux.

Deploy local PowerShell :

```powershell
Set-Location "C:\Users\ysanc\Downloads\flexroyale-rebuild"
$proc = Start-Process node -ArgumentList '"C:\Users\ysanc\AppData\Roaming\npm\node_modules\vercel\dist\index.js" --prod --yes --token TOKEN' `
  -WorkingDirectory "C:\Users\ysanc\Downloads\flexroyale-rebuild" `
  -RedirectStandardOutput deploy_out.txt -RedirectStandardError deploy_err.txt `
  -NoNewWindow -PassThru
Start-Sleep -Seconds 45
Get-Content deploy_err.txt | Select-Object -Last 15
```

## Grades
Le type grade doit rester synchronise dans `lib/grades.ts`, `types/clash.ts` et les composants qui le rededeclarent.

```ts
export type Grade = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D';
```

Seuils :
- `S+` >= 950
- `S` >= 750
- `A` >= 550
- `B` >= 350
- `C` >= 150
- `D` < 150

Images attendues :
- `public/grades/S-plus.png`
- `public/grades/S.png`
- `public/grades/A.png`
- `public/grades/B.png`
- `public/grades/C.png`
- `public/grades/D.png`

## Regle anti-regression
Avant toute modification d'un fichier existant :

1. Lire le fichier en entier juste avant l'edition.
2. Identifier les features deja presentes : grades, images locales, leaderboard, i18n, SEO, loading states.
3. Ne jamais ecraser une feature existante sans demande explicite.
4. Si une feature est reimplementee, verifier que les autres features du meme fichier sont preservees.

## Fichiers critiques
En cas d'ajout de grade ou de build TypeScript casse, verifier en priorite :

- `types/clash.ts`
- `lib/grades.ts`
- `lib/calculator.ts`
- `components/BattleCard.tsx`
- `components/FlexGrade.tsx`
- `lib/i18n.ts`

En cas d'echec Vercel avec seulement `Command "npm run build" exited with 1`, inspecter d'abord les types partages et les types `Grade` rededeclares localement.

## Verification calculs
Avant de deployer un changement de calcul :

1. Lancer les tests.
2. Verifier qu'aucune valeur n'est comptee deux fois.
3. Verifier les plafonds connus : evolutions max = 40, score max = 1000.
4. Justifier toute variation de valeur superieure a 20%.

## Continuite
Lire `TASKS.md` au debut de chaque reprise. Mettre `TASKS.md` a jour des qu'une tache importante commence ou se termine.

Quand la reprise vient d'une session Claude, copier dans `TASKS.md` :

- ce que Claude disait avoir termine ;
- les fichiers qu'il disait avoir modifies ;
- les fichiers restant a traiter ;
- si le chantier est deploye, commit, ou seulement local.

## Assets utilisateur
Priorite aux fichiers locaux fournis par l'utilisateur avant les URLs externes. Les battle cards doivent garder les PNG locaux de `public/grades/`.
