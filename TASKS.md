# TASKS.md - FlexRoyale

## Etat de reprise
Derniere reprise Codex preparee le 2026-06-02.

Important : Codex est un plan B. Claude Cowork reste le flux principal du projet. Utiliser Codex pour reprendre quand Claude n'a plus de tokens, pour verifier l'etat local, ou pour finir une tache uniquement si l'utilisateur le demande explicitement.

Le projet local actif est :

```text
C:\Users\ysanc\Downloads\flexroyale-rebuild
```

## Etat fonctionnel connu
- [x] App Next.js 14 App Router avec TypeScript et Tailwind.
- [x] Calcul de valeur de compte Clash Royale.
- [x] Grades `S+`, `S`, `A`, `B`, `C`, `D`.
- [x] Battle cards avec images PNG locales dans `public/grades/`.
- [x] Leaderboard Redis et compteur de joueurs.
- [x] Loading skeleton sur `app/player/[tag]/loading.tsx`.
- [x] SEO de base avec sitemap, robots et images publiques.
- [x] Proxy Clash Royale via Fly.io dans `lib/api.ts`.
- [x] Pages `/grade/[grade]` accessibles depuis la homepage via le footer, d'apres la reprise Claude.

## En cours
- [ ] Re-skin Bauhaus/terreux commence par Claude, non termine et non confirme deploye.

## Termine
- [x] Reprise/migration Codex : `AGENTS.md`, `TASKS.md`, `CODEX_SETUP.md` et `CLAUDE.md` prepares.
- [x] Verification locale apres reprise : `npm run build` OK, `npm test` OK.
- [x] Dernier texte Claude integre dans l'etat de reprise Codex.

## Derniere reprise Claude collee le 2026-06-02
Claude a indique avoir commence un re-skin complet :

- Regles ajoutees dans `CLAUDE.md` : Bauhaus minimaliste, tons terreux, pas de gradients, pas de violet, pas d'emojis UI/commentaires, pas d'arrondis, Bootstrap Icons.
- Fichiers de fondation traites : `tailwind.config.ts`, `app/globals.css`.
- Couche data traitee : `lib/grades.ts`, `lib/calculator.ts`.
- Composants traites ou partiellement traites : `components/BattleCard.tsx`, `components/FlexGrade.tsx`, `components/StatsRow.tsx`, `components/ValueBreakdown.tsx`, `components/PlayerCard.tsx`.
- Claude s'est arrete apres les editions de `PlayerCard.tsx`, avant build/deploy final de ce chantier.

Etat detecte par Codex : il reste encore des traces de l'ancien style ou d'emojis dans plusieurs zones, notamment :

- `app/page.tsx`
- `app/grade/[grade]/page.tsx`
- `app/compare/page.tsx`
- `app/api/og/route.ts`
- `components/AccountBonusValue.tsx`
- `components/Footer.tsx`
- `components/LanguageSwitcher.tsx`
- `components/PlayerErrorUI.tsx`
- `components/RarityRanking.tsx`
- `components/SearchForm.tsx`
- `components/ShareCard.tsx`
- `components/TopFlexers.tsx`
- `app/player/[tag]/loading.tsx`

Ne pas considerer le re-skin comme termine tant que ces fichiers n'ont pas ete revus, buildes, testes et verifies visuellement.

## Points d'attention
- Le worktree etait deja modifie au moment de cette reprise. Ne pas ecraser les changements existants.
- `CLAUDE.md` contient des instructions Claude et des notes UI deja modifiees localement.
- `app/page.tsx` contient des changements UI en cours : verifier le rendu avant tout deploy.
- `npm run build` signale un warning non bloquant dans `components/TopFlexers.tsx` : dependance React Hook `onCountChange`.
- Les secrets GitHub, Vercel, Redis ou Clash Royale doivent rester hors Git.
- Si l'utilisateur demande de reprendre le re-skin avec Codex, commencer par lire en entier chaque fichier touche par Claude, puis continuer fichier par fichier.

## Checklist avant deploy
- [ ] Lire les fichiers touches en entier avant modification.
- [ ] Lancer `npm run build`.
- [ ] Lancer `npm test` si le calculateur, les types ou le leaderboard changent.
- [ ] Verifier visuellement l'app si une page ou un composant UI change.
- [ ] Mettre a jour ce fichier avec la tache terminee et la prochaine action.

## Prompt de reprise Codex
```text
Tu es le plan B Codex pour FlexRoyale. Claude Cowork reste le flux principal.
Lis AGENTS.md puis TASKS.md avant toute action.
Respecte la regle anti-regression : lis les fichiers avant de les modifier et preserve les features existantes.

Repo : https://github.com/ark0s1/flexroyale
Branche : main
Live : https://flexroyale.vercel.app

Tache a faire :
[decrire ici la prochaine feature ou correction]
```
