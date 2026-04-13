# Digital Sanctuary Mobile — Plan d'implémentation

> Application mobile React Native (Expo) pour la plateforme de thérapie DBT Digital Sanctuary.  
> Objectif : reproduire **pixel pour pixel** les designs Stitch et consommer l'API Rails existante.

---

## 1. Vue d'ensemble

### Qu'est-ce que l'app fait ?

Digital Sanctuary est un journal émotionnel guidé par la méthode DBT (Diélectique Comportementale). Le flux principal est appelé **CALM** : un workflow en 8 étapes qui guide l'utilisateur pour documenter complètement une observation émotionnelle (déclencheur, vulnérabilité, interprétations, sensations, impulsions, actions, répercussions).

### Stack technique

| Couche | Outil |
|---|---|
| Framework | Expo SDK 52 (TypeScript) |
| Navigation | React Navigation 6 (Stack + Bottom Tabs) |
| HTTP | Axios |
| Auth storage | `expo-secure-store` |
| Icons | `@expo/vector-icons` (Material Icons) |
| Fonts | Google Fonts — **Manrope** (300–800) |
| State global | React Context (AuthContext + CalmContext) |

---

## 2. API Rails

**Base URL** : `https://6n8k0.hatchboxapp.com/api/v1`  
**Auth** : `Authorization: Bearer <token>` (JWT 7 jours)  
**Format** :
```json
// Succès
{ "success": true, "data": {...}, "meta": {...} }
// Erreur
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

### Endpoints

| Méthode | Route | Corps / Params | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | `{ name, email, password }` | Créer un compte → `{ token, user }` |
| `POST` | `/auth/login` | `{ email, password }` | Connexion → `{ token, user }` |
| `DELETE` | `/auth/logout` | — | Révoque le token |
| `GET` | `/auth/me` | — | Profil de l'utilisateur connecté |
| `GET` | `/emotion_entries` | `?cursor=` | Liste paginuu00e9e (100/page, desc) |
| `POST` | `/emotion_entries` | voir modèle ci-dessous | Créer une entrée |
| `GET` | `/emotion_entries/:id` | — | Détail d'une entrée |
| `PATCH` | `/emotion_entries/:id` | champs partiels | Modifier une entrée |
| `DELETE` | `/emotion_entries/:id` | — | Supprimer une entrée |
| `GET` | `/statistics` | — | `{ total_entries, streak, reflections }` |
| `GET` | `/health` | — | Vérification API |

### Modèle `EmotionEntry`

```typescript
interface EmotionEntry {
  id: string;                // UUID v4
  emotion_name: string;      // REQUIS
  intensity: number;         // REQUIS, 0–100
  trigger?: string;          // Déclencheur
  vulnerability?: string;    // Vulnérabilité
  interpretations?: string;  // Interprétations
  sensations?: string;       // Sensations physiques
  urges?: string;            // Urgences / impulsions
  body_language?: string;    // Langage corporel
  words_said?: string;       // Ce que j'ai dit
  actions_taken?: string;    // Ce que j'ai fait
  repercussions?: string;    // Répercussions
  created_at: string;        // ISO 8601
  updated_at: string;
}
```

---

## 3. Design System

Extrait des fichiers Stitch HTML. L'app utilise un système de design **Material You** avec une palette bleue-verte apaisante.

### Couleurs

```typescript
export const colors = {
  // Surfaces
  background:               '#f4f6ff',
  surface:                  '#f4f6ff',
  surfaceContainerLowest:   '#ffffff',
  surfaceContainerLow:      '#eaf1ff',
  surfaceContainer:         '#dce9ff',
  surfaceContainerHigh:     '#d3e4ff',
  surfaceContainerHighest:  '#c9deff',

  // Texte
  onBackground:             '#13304f',
  onSurface:                '#13304f',
  onSurfaceVariant:         '#435d7f',
  outline:                  '#5f789c',
  outlineVariant:           '#95afd5',

  // Primaire (bleu)
  primary:                  '#17618b',
  primaryFixed:             '#90cdfd',
  primaryContainer:         '#90cdfd',
  onPrimary:                '#eaf4ff',
  onPrimaryContainer:       '#004466',

  // Secondaire (vert)
  secondary:                '#006b1f',
  secondaryContainer:       '#8df48e',
  onSecondaryContainer:     '#005c19',

  // Tertiaire (violet doux)
  tertiary:                 '#595a6b',
  tertiaryContainer:        '#e6e6fa',

  // Erreur
  error:                    '#b31b25',
  errorContainer:           '#fb5151',
  onError:                  '#ffefee',

  white:                    '#ffffff',
  black:                    '#000f22',
};
```

### Typographie

Police unique : **Manrope** via `@expo-google-fonts/manrope`

| Token | Taille | Graisse |
|---|---|---|
| displaySmall | 36 | 700 |
| headlineLarge | 32 | 600 |
| headlineMedium | 28 | 600 |
| headlineSmall | 24 | 600 |
| titleLarge | 22 | 500 |
| titleMedium | 16 | 500 |
| bodyLarge | 16 | 400 |
| bodyMedium | 14 | 400 |
| labelLarge | 14 | 500 |
| labelSmall | 11 | 300 |

### Espacements & Rayons

```
spacing : xs=4  sm=8  md=16  lg=24  xl=32  xxl=48
radius  : sm=8  md=16 (DEFAULT)  lg=32  xl=48  full=9999
```

---

## 4. Navigation

```
RootNavigator
├── AuthStack              (si non connecté)
│   ├── LoginScreen
│   └── RegisterScreen
└── MainTabs               (si connecté)
    ├── Tab "Sanctuary"  (home_health)  → HomeScreen
    ├── Tab "Journal"    (auto_stories) → ProfileScreen
    ├── Tab "Skills"     (self_improvement) → SkillsScreen
    ├── Tab "Profile"    (person)       → ProfileScreen
    └── Modal CalmStack
        ├── Step 1 : EmotionNuancesScreen
        ├── Step 2-3 : TriggerVulnScreen
        ├── Step 4-5 : InterpSensScreen
        ├── Step 6-7 : UrgesActionScreen
        └── Step 8 : RepercussionScreen
```

---

## 5. Détail des screens

### LoginScreen
- Logo `spa` + "Digital Sanctuary" + "Retrouvez votre calme intérieur."
- Champs : E-MAIL (`mail`), MOT DE PASSE (`lock`) + lien "Oublié ?"
- CTA "Se connecter" + `arrow_forward`
- Footer : Conditions · Confidentialité · Aide
- Appel : `POST /auth/login` → token dans SecureStore

### RegisterScreen
- Logo + "Commencez votre voyage vers la sérénité."
- Champs : NOM COMPLET, E-MAIL, MOT DE PASSE (≥8 caractères)
- CTA "Créer mon compte"
- Badges : `verified_user` Sécurisé & Privé, `eco` DBT Approuvé, `favorite` Recommandé
- Appel : `POST /auth/signup`

### HomeScreen (Tableau de Bord)
- "Tableau de Bord" + "Mes Observations"
- Liste des entrées groupées par jour avec icône + nom + heure + intensité
- Citation inspirante
- FAB `add` → ouvre CalmStack
- Appels : `GET /emotion_entries` + `GET /statistics`

### ProfileScreen (Data-Soul)
- En-tête `analytics` + "Data-Soul"
- Graphique 15 jours + labels STABLE / ÉLÉVATION / CALME / VITALITÉ
- Flux journalier d'entrées avec icône + titre + heure + extrait
- FAB `add` + "Écrire"
- Appels : `GET /emotion_entries` + `GET /statistics`

### Step 1 — EmotionNuancesScreen
- "L'Émotion — 1/8 — Quelle sensation traverse votre esprit?"
- Grille 2 colonnes : Tristesse, Colère, Dégoût, Envie, Peur, Joie, Jalousie, Amour, Honte, Culpabilité
- Section nuances : chips Déception, Désespoir, Nostalgie...
- → `emotion_name`

### Steps 2-3 — TriggerVulnScreen
- **Déclencheur** : grande textarea "Qu'est-ce qui s'est passé ?"
- **Vulnérabilité** : 3 sliders (Sommeil, Stress, Alimentation)
- → `trigger`, `vulnerability`

### Steps 4-5 — InterpSensScreen
- **Interprétations** : textarea
- **Sensations** : checkboxes Visage chaud, Poitrine serrée, Mains tremblantes, Souffle court + champ libre
- → `interpretations`, `sensations`

### Steps 6-7 — UrgesActionScreen
- **Urgences** : textarea "Ce que vous vouliez faire"
- **Expression** : 3 textareas Langage Corporel / Ce que j'ai dit / Ce que j'ai fait
- → `urges`, `body_language`, `words_said`, `actions_taken`

### Step 8 — RepercussionScreen
- 3 champs répercussions (sensations persistantes, nouvelles pensées, écho)
- Récapitulatif global (toutes les étapes)
- CTA `task_alt` "Sauvegarder" + message félicitation
- **Appel API** : `POST /emotion_entries` avec toutes les données

---

## 6. Structure de code

```
digital-sanctuary-mobile/
├── App.tsx                    # Fonts + providers + RootNavigator
├── app.json
├── package.json
└── src/
    ├── api/
    │   ├── client.ts              # Axios baseURL + intercepteur 401
    │   ├── auth.ts
    │   ├── emotionEntries.ts
    │   └── statistics.ts
    ├── contexts/
    │   ├── AuthContext.tsx        # SecureStore + user state
    │   └── CalmContext.tsx        # Draft EmotionEntry accumulé sur 8 étapes
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthStack.tsx
    │   ├── MainTabs.tsx
    │   └── CalmStack.tsx
    ├── screens/
    │   ├── auth/LoginScreen.tsx
    │   ├── auth/RegisterScreen.tsx
    │   ├── home/HomeScreen.tsx
    │   ├── profile/ProfileScreen.tsx
    │   ├── calm/Step1EmotionScreen.tsx
    │   ├── calm/Step23TriggerScreen.tsx
    │   ├── calm/Step45InterpSensScreen.tsx
    │   ├── calm/Step67UrgesScreen.tsx
    │   └── calm/Step8RepercScreen.tsx
    ├── components/
    │   ├── ui/Button.tsx
    │   ├── ui/Input.tsx
    │   ├── ui/Card.tsx
    │   ├── ui/EmotionChip.tsx
    │   ├── ui/CalmProgressBar.tsx
    │   ├── ui/MaterialIcon.tsx
    │   ├── ui/Slider.tsx
    │   └── layout/SafeScreen.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useEmotionEntries.ts
    ├── theme/index.ts             # colors + typography + spacing + radius
    └── types/index.ts             # EmotionEntry, User, ApiResponse<T>, Stats
```

---

## 7. Dépendances

```json
{
  "expo": "~52.0.0",
  "@react-navigation/native": "^6",
  "@react-navigation/bottom-tabs": "^6",
  "@react-navigation/stack": "^6",
  "react-native-screens": "*",
  "react-native-safe-area-context": "*",
  "axios": "^1.7",
  "expo-secure-store": "*",
  "expo-font": "*",
  "@expo-google-fonts/manrope": "*",
  "@expo/vector-icons": "*"
}
```

---

## 8. Ordre d'implémentation

1. Bootstrap `create-expo-app` + installation
2. `src/types/index.ts`
3. `src/theme/index.ts`
4. API layer (client + modules)
5. AuthContext + CalmContext
6. Composants UI de base
7. Navigation (Root + Auth + MainTabs + CalmStack)
8. Screens auth (Login + Register)
9. HomeScreen + ProfileScreen
10. CalmStack (5 écrans)

---

## 9. Vérification

| Test | Critère |
|---|---|
| Inscription | Compte créé, token stocké, redirect Home |
| Connexion | Token récupéré au redémarrage |
| CALM complet | `POST /emotion_entries` retourne 201 |
| Journal | Entrée visible dans ProfileScreen |
| Déconnexion | Token supprimé, retour Login |
| 401 auto | Token expiré → redirect Login sans crash |
