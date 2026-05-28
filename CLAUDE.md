# FlexRoyale — CLAUDE.md

## Projet
Next.js 14 App Router · TypeScript · Tailwind CSS  
Estimation monétaire d'un compte Clash Royale.  
Live : https://flexroyale.vercel.app

## Chemins importants
- **Projet** : `C:\Users\ysanc\AppData\Roaming\Claude\local-agent-mode-sessions\2c8be573-7893-40e5-8590-3c2be6ba1636\ca4525b0-558a-4a81-ba3d-e823fe81db50\local_c66f473e-6edf-4a08-8a2d-2b2024da740f\outputs\flexroyale`
- **Node** : `C:\Program Files\nodejs\node.exe`
- **Vercel CLI** : `C:\Users\ysanc\AppData\Roaming\npm\vercel.cmd`
- **Bat de déploiement** : `C:\Users\ysanc\Desktop\deploy_flex.bat`

## Architecture CR API (IMPORTANT — changement majeur)
Le proxy Fly.io (`cr-proxy-flexroyale.fly.dev`) a été **abandonné** (trial expiré).  
L'app appelle maintenant le CR API **directement** depuis Vercel :
- `lib/api.ts` → `https://api.clashroyale.com/v1` avec `Authorization: Bearer $CR_API_TOKEN`
- Le token est stocké en variable d'environnement Vercel : `CR_API_TOKEN`
- La clé CR doit avoir IP whitelist = `0.0.0.0/0` (Vercel a des IPs dynamiques)

## Déploiement — AUTONOME, jamais demander à l'utilisateur
Toujours déployer soi-même. Commande PowerShell qui fonctionne :

```powershell
$env:PATH = "C:\Program Files\nodejs;C:\Users\ysanc\AppData\Roaming\npm;" + $env:PATH
Set-Location "C:\Users\ysanc\AppData\Roaming\Claude\local-agent-mode-sessions\2c8be573-7893-40e5-8590-3c2be6ba1636\ca4525b0-558a-4a81-ba3d-e823fe81db50\local_c66f473e-6edf-4a08-8a2d-2b2024da740f\outputs\flexroyale"
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
- Chemin sandbox bash : `/sessions/.../mnt/outputs/flexroyale`
- Chemin Windows : `C:\Users\ysanc\...\outputs\flexroyale`

## Règles d'édition de code
- **Toujours** `Read` un fichier juste avant de l'éditer, même s'il a été lu plus tôt
- Pour les remplacements > 50 lignes : utiliser `Write` au lieu de `Edit` (pas de risque "string not found")
- Après chaque écriture, vérifier que la modification est correcte

## Checklist avant déploiement
1. Vérifier le build : `npm run build` dans le sandbox
2. Confirmer 0 erreur TypeScript (warnings OK)
3. Ne jamais déployer si le build échoue

## Gestion du contexte
Quand le contexte approche la limite, écrire un résumé structuré dans :
`outputs/SESSION_STATE.md`

Inclure : tâche en cours, fichiers modifiés (chemins complets + changements), prochaine action, URL live, bugs connus.

Au démarrage d'une nouvelle session : lire SESSION_STATE.md en premier.

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
