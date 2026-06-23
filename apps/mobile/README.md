# Elegante Amaro — App Mobile (client)

Application client de la plateforme Elegante Amaro : parcourir la carte, visualiser les
produits en **3D**, composer et payer une commande, suivre son état, et cumuler des
**points de fidélité**. Direction artistique **luxe / gastronomique immersive**.

> Fait partie du monorepo. **Ne pas faire `npm install` ici** — lancez-le à la racine.
> Voir le [README racine](../../README.md) pour la vue d'ensemble.

## Stack

- **Expo 54** + **React Native 0.81** (New Architecture activée)
- **expo-router 6** — routing par fichiers (`src/app/`)
- **React Navigation** (bottom tabs)
- **Reanimated 4** + **expo-haptics** — animations & retours haptiques
- **three** + **@react-three/fiber** + **@react-three/drei** + **expo-gl** — rendu 3D (`.glb`)
- **AsyncStorage** — persistance session & panier
- **@expo-google-fonts/\*** — typographies (script, serif, display)
- **TypeScript** strict, `reactCompiler` activé

## Démarrage

Le plus simple, depuis la **racine** du monorepo :

```bash
npm start          # install + DB + lance API + web + mobile (IP LAN auto-détectée)
```

Pour lancer le mobile **seul** :

```bash
npm run start --workspace @elegante-amaro/mobile
# ou : cd apps/mobile && npx expo start
```

Puis scannez le QR code avec **Expo Go**, ou lancez `npm run android` / `npm run ios`.

### Configuration réseau

L'app appelle l'API via une **IP LAN**, pas `localhost` (qui, sur un téléphone, désigne
le téléphone lui-même). **Bonne nouvelle : c'est automatique** quand vous lancez `npm start`
à la racine — le script détecte l'IP LAN de la machine et l'injecte dans `EXPO_PUBLIC_API_URL`.

À savoir :

- Le téléphone et la machine qui fait tourner l'API doivent être sur le **même Wi-Fi**.
- L'IP est **redétectée à chaque `npm start`** : changer de réseau ne demande plus aucune
  édition manuelle.
- **Forcer une URL** (tunnel, IP fixe, MySQL distant) : renseignez `EXPO_PUBLIC_API_URL` dans
  le **`.env` unique à la racine** → le script la respecte au lieu d'auto-détecter.
- **Mobile lancé seul** (hors `npm start`) : `EXPO_PUBLIC_API_URL` n'est pas injectée et l'app
  retombe sur `http://localhost:3000` (OK émulateur/web, **pas** pour un téléphone réel).
  Pour un device physique, passez par le script racine.
- **Windows natif** : récupérez l'IP avec `ipconfig` (*IPv4 Address* de la carte Wi-Fi) et
  mettez-la dans `.env` (`EXPO_PUBLIC_API_URL=http://VOTRE_IP:3000`).
- Les variables `EXPO_PUBLIC_*` sont **figées au bundling** : si l'URL ne change pas après
  coup, redémarrez Expo avec le cache vidé :

  ```bash
  npx expo start -c
  ```

Valeur par défaut (variable absente) : `http://localhost:3000`
(voir [`src/constants/config.ts`](src/constants/config.ts)).
Symptôme typique d'API injoignable : le logo qui « respire » à l'infini (voir plus bas).

## Scripts

```bash
npm run start   --workspace @elegante-amaro/mobile   # expo start
npm run android --workspace @elegante-amaro/mobile   # ouvre sur Android
npm run ios     --workspace @elegante-amaro/mobile   # ouvre sur iOS
npm run web     --workspace @elegante-amaro/mobile   # version web (RN Web)
npm run lint    --workspace @elegante-amaro/mobile   # eslint (config Expo)
```

## Structure

```
apps/mobile/
├── app.json                  # config Expo (plugins, splash, icônes)
├── metro.config.js           # config monorepo (résout @elegante-amaro-app/shared) + assets .glb/.gltf
├── babel.config.js           # preset Expo + plugin worklets (Reanimated)
└── src/
    ├── app/                   # ROUTES (expo-router, routing par fichiers)
    │   ├── _layout.tsx         # racine : fonts, providers (Auth, Cart), splash
    │   ├── index.tsx           # redirige vers /accueil
    │   ├── (tabs)/             # navigation par onglets
    │   │   ├── accueil.tsx      # accueil (carrousel + produit en 3D)
    │   │   ├── carte.tsx        # carte / menu
    │   │   ├── commande.tsx     # panier / commande en cours
    │   │   └── profil.tsx       # profil & fidélité
    │   ├── (auth)/             # login / register
    │   ├── item/[slug].tsx     # fiche produit (taille, options, ajout panier)
    │   ├── checkout/           # guest-info, payment, success/failure
    │   ├── account.tsx · orders.tsx · settings.tsx
    ├── components/            # UI réutilisable (home, item, menu, order, profile, ui…)
    ├── services/             # accès API
    │   ├── api/
    │   │   ├── client.ts       # client HTTP UNIQUE (le seul à faire fetch)
    │   │   ├── dto.ts          # formes brutes de l'API (snake_case) — dérivées de shared/types
    │   │   └── mappers.ts      # DTO → modèles app (camelCase)
    │   ├── menuService · orderService · authService · userService
    ├── store/                # état global (React Context)
    │   ├── auth/AuthContext.tsx   # session (persistée via AsyncStorage)
    │   └── cart/                  # panier (reducer + context)
    ├── hooks/                # useLiveData (fetch + refetch + polling), useCartTotals, useFonts
    ├── theme/                # typography, spacing, radius, shadows ; colors dérive de shared
    ├── types/                # modèles applicatifs camelCase (item, order, user)
    ├── constants/            # config, assets, greeting
    ├── lib/                  # fidelity, haptics
    └── public/              # polices & modèles 3D (.glb)
```

## Concepts clés

### Communication API en couches

Les écrans n'appellent **jamais** `fetch`. Le flux est :

```
écran → service (menu/order/auth/user) → client HTTP unique → API
```

L'API renvoie du **snake_case** (`extra_price`, `category_id`) ; les *mappers*
(`services/api/mappers.ts`) convertissent vers les modèles **camelCase** utilisés dans l'app.

### Chargement de données : `useLiveData`

[`hooks/useLiveData.ts`](src/hooks/useLiveData.ts) gère le chargement « pull » :
chargement initial au montage, refetch au retour de focus, polling optionnel
(suivi de commande) et pull-to-refresh.

> Actuellement `useLiveData` **avale silencieusement** les erreurs réseau pour conserver
> les données précédentes. Si le premier chargement échoue (ex. mauvaise `EXPO_PUBLIC_API_URL`),
> certains écrans restent sur `ScreenLoader` indéfiniment. En cas de logo qui clignote à
> l'infini → **vérifier que l'API est joignable depuis le téléphone** (voir config réseau).

### Rendu 3D

Les produits sont affichés en 3D via `@react-three/fiber` / `drei` sur `expo-gl`.
`metro.config.js` ajoute `glb`/`gltf` aux extensions d'assets pour charger les modèles
de `src/public/models/`.

### Auth & panier

- **Auth** : `AuthContext` recharge la session persistée (AsyncStorage) au démarrage et
  expose `login` / `register` / `logout` / `updateProfile` / `signInAs` (commande invité).
- **Panier** : `CartContext` + reducer, taille & options par ligne, totaux via `useCartTotals`.
