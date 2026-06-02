# FlexRoyale — CLAUDE.md

## Projet
Next.js 14 App Router · TypeScript · Tailwind CSS  
Estimation monétaire d'un compte Clash Royale.  
Live : https://flexroyale.vercel.app
GitHub : https://github.com/ark0s1/flexroyale

## Relation Claude / Codex
Claude Cowork reste le flux principal du projet.
Codex est seulement le plan B quand Claude n'a plus de tokens, perd le contexte, ou quand l'utilisateur veut une verification/reprise cote Codex.
Pour rendre les reprises propres, garder `TASKS.md` a jour avec l'etat exact des chantiers en cours.

## Chemins importants
- **Projet actif** : `C:\Users\ysanc\Downloads\flexroyale-rebuild`
- **Assets utilisateur / Cowork** : `C:\Users\ysanc\Downloads\Claude Battle cards`
- **Node** : `C:\Program Files\nodejs\node.exe`
- **Vercel CLI** : `C:\Users\ysanc\AppData\Roaming\npm\vercel.cmd`
- **Bat de déploiement** : `C:\Users\ysanc\Desktop\deploy_flex.bat`

## Architecture CR API
L'app appelle le proxy Fly.io, qui forward vers l'API Clash Royale :
- `lib/api.ts` → `https://cr-proxy-flexroyale.fly.dev/v1`
- Le proxy (`cr-proxy-flexroyale`) garde le token CR côté Fly.io
- Ne pas remplacer par des appels directs Vercel sans verifier le probleme d'IP dynamique

## Déploiement — AUTONOME, jamais demander à l'utilisateur
Toujours déployer soi-même. Commande PowerShell qui fonctionne :

```powershell
$env:PATH = "C:\Program Files\nodejs;C:\Users\ysanc\AppData\Roaming\npm;" + $env:PATH
Set-Location "C:\Users\ysanc\Downloads\flexroyale-rebuild"
Start-Process "C:\Users\ysanc\AppData\Roaming\npm\vercel.cmd" -ArgumentList "deploy","--prod","--yes" -WorkingDirectory (Get-Location).Path -RedirectStandardOutput "C:\Users\ysanc\Desktop\vercel_out.txt" -RedirectStandardError "C:\Users\ysanc\Desktop\vercel_err.txt" -NoNewWindow -Wait
Get-Content "C:\Users\ysanc\Desktop\vercel_out.txt","C:\Users\ysanc\Desktop\vercel_err.txt"
```

Ajouter une variable Vercel :
```powershell
$env:PATH = "C:\Program Files\nodejs;C:\Users\ysanc\AppData\Roaming\npm;" + $env:PATH
Set-Location "...\flexroyale"
echo "VALEUR" | & "C:\Users\ysanc\AppData\Roaming\npm\vercel.cmd" env add NOM_VAR production
```

## Règles Shell — CRITIQUE
- **JAMAIS** `cd /d` avec le chemin complet du projet → échoue silencieusement (chemin ~200 chars avec GUIDs)
- **TOUJOURS** `Set-Location` PowerShell pour naviguer
- **TOUJOURS** définir PATH manuellement avant node/vercel :
  ```powershell
  $env:PATH = "C:\Program Files\nodejs;C:\Users\ysanc\AppData\Roaming\npm;" + $env:PATH
  ```
- Pour les commandes longues : rediriger output vers fichier puis lire
- Chemin Windows actif : `C:\Users\ysanc\Downloads\flexroyale-rebuild`
- Codex cloud clone generalement le repo dans `/repo`

## Règles d'édition de code
- **Toujours** `Read` un fichier juste avant de l'éditer, même s'il a été lu plus tôt
- Pour les remplacements > 50 lignes : utiliser `Write` au lieu de `Edit` (pas de risque "string not found")
- Après chaque écriture, vérifier que la modification est correcte

## Checklist avant déploiement
1. Vérifier le build : `npm run build` dans le sandbox
2. Confirmer 0 erreur TypeScript (warnings OK)
3. Ne jamais déployer si le build échoue

## Gestion du contexte
Quand le contexte approche la limite, mettre a jour :
`TASKS.md`

Inclure : tâche en cours, fichiers modifiés (chemins complets + changements), prochaine action, URL live, bugs connus.

Au démarrage d'une nouvelle session : lire `AGENTS.md` puis `TASKS.md` en premier.

## Autonomie utilisateur
Cet utilisateur veut le maximum d'autonomie :
- Ne jamais demander "dois-je continuer ?" → faire directement
- Ne jamais dire "tu dois faire X manuellement" sauf si c'est vraiment impossible (mots de passe, 2FA)
- Utiliser Desktop Commander ou Claude in Chrome avant de demander à l'utilisateur
- Si une action requiert l'utilisateur, grouper TOUT en une seule demande à la fin

## Assets Clash Royale
CDN images cartes : `https://api-assets.clashroyale.com/cards/300/{hash}.png`
Liste des cartes avec hashes : `https://api.clashroyale.com/v1/cards` (avec CR_API_TOKEN)

Toujours utiliser les vrais assets du jeu, jamais de SVG générés pour les visuels CR.

Hashes cartes clés :
- Mega Knight (Grade S): `O2NycChSNhn_UK9nqBXUhhC_lILkiANzPuJjtjoz0CE`
- P.E.K.K.A (Grade A): `MlArURKhn_zWAZY-Xj1qIRKLVKquarG25BXDjUQajNs`
- Knight (Grade B): `jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg`
- Baby Dragon (Grade C): `cjC9n4AvEZJ3urkVh-rwBkJ-aRSsydIMqSAV48hAih0`
- Skeleton King (Grade D): `dCd69_wN9f8DxwuqOGtR4QgWhHIPIaTNxZ1e23RzAAc`

## Constantes calculateur
```ts
const GEMS_PER_EURO = 130;
// maxLevel par rareté (relatif, depuis l'API) :
// Common=14, Rare=12, Epic=9, Legendary=6, Champion≈11
```

## Stack technique
- Next.js 14 App Router, TypeScript, Tailwind CSS
- Déployé sur Vercel (projet: grouparkus-1706s-projects/flexroyale)
- Images cartes CDN: https://api-assets.clashroyale.com/cards/300/{hash}.png

## Design / UI — règles
- Style minimaliste inspiré du Bauhaus : formes simples, géométriques, fonctionnelles.
- Palette de tons terreux (ocre, terracotta, sable, brun, vert olive...). Pas de violet.
- Pas de dégradés : aplats de couleur uniquement.
- Pas d'emojis dans l'interface utilisateur ni dans les commentaires de code.
- Pas de bords arrondis (border-radius: 0) sauf indication explicite du contraire.
- Icônes via une bibliothèque (Bootstrap Icons : https://icons.getbootstrap.com/), jamais d'emojis.
- Important : ces règles s'appliquent au nouveau code. Le design ACTUEL de FlexRoyale est l'opposé
  (néon, dégradés, violet sur le grade C, emojis partout, coins arrondis). Re-skinner l'app existante
  est un chantier séparé, à valider avant exécution.
