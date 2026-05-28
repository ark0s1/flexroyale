# ⚔️ FlexRoyale — Calculateur de valeur de compte Clash Royale

Calcule la valeur estimée de ton compte Clash Royale en euros. Génère ta share card et flex sur les réseaux sociaux !

**Stack :** Next.js 14 · TypeScript · Tailwind CSS · Netlify · satori + sharp (OG images)

---

## 🔑 Section 1 — Obtenir le token API Clash Royale

1. Va sur https://developer.clashroyale.com
2. Clique sur **"Login"** → connecte-toi avec ton compte Supercell
3. Clique sur **"My Account"** → **"Create New Key"**
4. Donne un nom à ta clé (ex: `FlexRoyale`)
5. Dans **"Allowed IP Addresses"**, entre : `0.0.0.0/0` (accepte toutes les IPs)
   - ⚠️ En production, restreins aux IPs de Netlify pour plus de sécurité
6. Copie le token généré → place-le dans `.env.local`

---

## 💻 Section 2 — Installation locale

```bash
git clone <ton-repo>
cd flexroyale
npm install
cp .env.example .env.local
# Ouvre .env.local et remplis CLASH_ROYALE_API_TOKEN avec ton token
npm run dev
# Ouvre http://localhost:3000
```

---

## 🚀 Section 3 — Déploiement sur Netlify (étape par étape)

### Étape 1 — Push sur GitHub

```bash
git init
git add .
git commit -m "feat: FlexRoyale initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/flexroyale.git
git push -u origin main
```

### Étape 2 — Créer le site sur Netlify

1. Va sur https://netlify.com → crée un compte gratuit
2. Clique **"Add new site"** → **"Import an existing project"**
3. Connecte ton compte GitHub
4. Sélectionne le repo **flexroyale**
5. Paramètres de build :
   - Build command : `npm run build`
   - Publish directory : `.next`
6. Clique **"Deploy site"**

### Étape 3 — Variables d'environnement sur Netlify

Va dans **Site Settings → Environment variables → Add a variable** :

| Clé | Valeur |
|-----|--------|
| `CLASH_ROYALE_API_TOKEN` | ton token API Clash Royale |
| `NEXT_PUBLIC_SITE_URL` | `https://ton-site.netlify.app` |

Puis **Deploys → Trigger deploy → Deploy site**.

### Étape 4 — Domaine personnalisé (optionnel)

Dans **Domain settings → Add custom domain** → suis les instructions DNS.

---

## 💰 Section 4 — Configurer Google AdSense

1. Va sur https://adsense.google.com
2. Crée un compte → entre l'URL de ton site Netlify
3. Attends l'approbation (**1 à 14 jours**)
4. Une fois approuvé, copie ton **Publisher ID** (format : `ca-pub-XXXXXXXX`)
5. Dans Netlify → Environment variables :
   - Ajoute `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXX`
6. Redéploie → les pubs apparaissent automatiquement dans les zones prévues

---

## 🔧 Section 5 — Résolution des problèmes courants

| Erreur | Solution |
|--------|----------|
| `API Token invalide` ou `403` | Vérifie que l'IP `0.0.0.0/0` est autorisée dans le dashboard CR API |
| `Token API manquant` | Remplis `CLASH_ROYALE_API_TOKEN` dans `.env.local` |
| `Module not found: satori` | Lance `npm install satori sharp` |
| `Font not found` | Vérifie que `public/fonts/Inter-Bold.ttf` existe |
| `Build failed on Netlify` | Vérifie que `netlify.toml` est bien à la racine du projet |
| `Cannot read properties of undefined` | Tag joueur invalide ou API CR temporairement indisponible |
| `Workspace still starting` | Attends 30 secondes et relance `npm run dev` |

---

## 📁 Structure du projet

```
flexroyale/
├── app/
│   ├── layout.tsx              # Layout global avec metadata SEO
│   ├── page.tsx                # Page d'accueil
│   ├── globals.css             # Styles globaux
│   ├── player/[tag]/page.tsx   # Page de résultat joueur
│   ├── compare/page.tsx        # Comparaison entre deux joueurs
│   └── api/
│       ├── player/route.ts     # Route API → appel Clash Royale API
│       └── og/route.ts         # Génération image OG avec satori + sharp
├── components/                 # Composants React
├── lib/
│   ├── api.ts                  # Appels API Clash Royale
│   ├── calculator.ts           # Algorithme de calcul de valeur
│   ├── grades.ts               # Logique des grades S/A/B/C/D
│   └── utils.ts                # Utilitaires
├── types/clash.ts              # Types TypeScript
├── public/fonts/               # Police Inter-Bold (requise pour satori)
├── netlify.toml                # Config Netlify (OBLIGATOIRE)
└── .env.example                # Template variables d'environnement
```

---

## ⚠️ Mentions légales

This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell's Fan Content Policy](https://supercell.com/en/fan-content-policy/).

Clash Royale® is a trademark of Supercell Oy. All card values are estimations only.
