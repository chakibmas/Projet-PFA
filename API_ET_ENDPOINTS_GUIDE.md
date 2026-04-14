# 🚀 Guide Complet : API & Endpoints - Du Début à la Fin

**Ce guide explique comment fonctionne la communication entre votre application React et le serveur Backend.**

---

## 📚 Table des Matières
1. [C'est quoi une API?](#quest-quoi-une-api)
2. [C'est quoi un Endpoint?](#quest-quoi-un-endpoint)
3. [Comment ça fonctionne?](#comment-ça-fonctionne)
4. [Les différents types de requêtes](#les-différents-types-de-requêtes)
5. [Dialogues Réels - Exemples Concrets](#dialogues-réels---exemples-concrets)
6. [Structure d'une requête API](#structure-dune-requête-api)
7. [Réponses du serveur](#réponses-du-serveur)
8. [Code React Simplifié](#code-react-simplifié)
9. [Erreurs et Problèmes](#erreurs-et-problèmes)
10. [Résumé Visual](#résumé-visual)

---

## C'est quoi une API?

### Définition Simple

**API = Application Programming Interface** (Interface de Programmation d'Application)

C'est un **contrat de communication** entre deux applications.

**Analogie Réelle:**
```
Imagine un RESTAURANT:

❌ Pas d'API = Tu entres en cuisine, tu prépares ton repas toi-même
✅ Avec API = Tu commandes au serveur, il prépare et te ramène le repas

L'API = Le serveur qui te comprend et te ramène le résultat
```

### Exemple dans votre projet

```
┌─────────────────────────┐         🌐 INTERNET          ┌──────────────────┐
│  Application React      │                              │  Serveur Backend  │
│   (Frontend)            │◄────API Communication────►│   (Spring Boot)    │
│                         │                              │                   │
│ - Interface utilisateur │                              │ - Base de données │
│ - Boutons, formulaires  │                              │ - Logique métier  │
│ - Affichage des données │                              │ - Règles métier   │
└─────────────────────────┘                              └──────────────────┘
   Sur ton ordinateur                                    Sur un serveur distant
```

---

## C'est quoi un Endpoint?

### Définition Simple

Un **Endpoint** est une **adresse spécifique** sur le serveur où vous demandez quelque chose.

**Analogie Réelle:**
```
Comme une ADRESSE POSTALE:

5 Rue de Paris, 75000 Paris
│     │              │
│     │              └─ Ville
│     └──────────────── Rue
└────────────────────── Numéro

https://api.example.com/api/users/123
│           │           │      │     │
│           │           │      │     └─ ID utilisateur
│           │           │      └────── Ressource (utilisateurs)
│           │           └──────────── API prefix
│           └────────────────────── Domaine
└─────────────────────────────────── Protocole (HTTPS)
```

### Exemples d'Endpoints

```
GET  /api/users              → Récupérer TOUS les utilisateurs
GET  /api/users/123          → Récupérer l'utilisateur AVEC ID 123
POST /api/users              → CRÉER un nouvel utilisateur
PUT  /api/users/123          → MODIFIER l'utilisateur 123
DELETE /api/users/123        → SUPPRIMER l'utilisateur 123
```

---

## Comment ça fonctionne?

### Le Processus Complet (Étape par Étape)

```
ÉTAPE 1: L'utilisateur clique sur un bouton
         ↓
┌─────────────────────────────────────┐
│ Button: "Enregistrer mon profil"    │
└─────────────────────────────────────┘

ÉTAPE 2: React collecte les données du formulaire
         ↓
         {
           firstName: "Jean",
           lastName: "Dupont",
           email: "jean@example.com"
         }

ÉTAPE 3: React envoie une REQUÊTE au serveur
         ↓
         PUT /api/auth/profile
         Données: { firstName, lastName, email }

ÉTAPE 4: Le serveur reçoit la requête
         ├─ Vérifie si c'est valide
         ├─ Sauvegarde dans la base de données
         └─ Prépare une RÉPONSE

ÉTAPE 5: Le serveur renvoie la RÉPONSE
         ↓
         Status: 200 OK (succès)
         Données: { id: 1, firstName: "Jean", ... }

ÉTAPE 6: React reçoit la réponse
         ├─ Affiche un message "Profil enregistré!"
         ├─ Met à jour l'affichage
         └─ L'utilisateur voit les changements

FIN ✅
```

### Diagramme Simplifié

```
React App                          Serveur Backend
    │                                    │
    │  "Je veux créer un user"          │
    ├──────────────────────────────────►│
    │                                    ├─ Reçoit
    │                                    ├─ Valide
    │                                    ├─ Sauvegarde en DB
    │                                    │
    │  "Voilà! User créé avec ID 42"   │
    │◄──────────────────────────────────┤
    │                                    │
    ├─ Reçoit
    ├─ Affiche "Succès!"
    └─ Met à jour l'écran
```

---

## Les différents types de requêtes

### Analogie avec un MAGASIN

```
GET    = Demander "C'est quoi le prix?"        (lecture)
POST   = Demander "Je veux acheter ça"         (créer)
PUT    = Demander "Je veux modifier ma commande" (modifier)
DELETE = Demander "J'annule ma commande"       (supprimer)
```

### Explications Détaillées

#### 1. GET - Récupérer des données

```typescript
// Demande : "Donne-moi les infos de l'utilisateur 123"
GET /api/users/123

// Réponse du serveur:
{
  id: 123,
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean@example.com"
}

// En React:
const { data: user } = useQuery({
  queryFn: () => apiGet('/api/users/123')
});
// user = { id: 123, firstName: "Jean", ... }

// Affichage:
<p>{user.firstName} {user.lastName}</p>
// Affiche: "Jean Dupont"
```

#### 2. POST - Créer quelque chose

```typescript
// Demande : "Crée un nouvel utilisateur avec ces données"
POST /api/users
Body: {
  firstName: "Alice",
  lastName: "Martin",
  email: "alice@example.com"
}

// Réponse du serveur:
{
  id: 456,  // ← Nouvel ID créé par le serveur
  firstName: "Alice",
  lastName: "Martin",
  email: "alice@example.com",
  createdAt: "2024-04-09"
}

// En React:
const mutation = useMutation({
  mutationFn: (data) => apiPost('/api/users', data)
});

// Utilisation:
mutation.mutate({
  firstName: "Alice",
  lastName: "Martin",
  email: "alice@example.com"
});
```

#### 3. PUT - Modifier quelque chose

```typescript
// Demande : "Modifie l'utilisateur 123 avec ces données"
PUT /api/users/123
Body: {
  firstName: "Jean-Pierre",  // ← Changé
  lastName: "Dupont",
  email: "jean.pierre@example.com"  // ← Changé
}

// Réponse du serveur:
{
  id: 123,
  firstName: "Jean-Pierre",
  lastName: "Dupont",
  email: "jean.pierre@example.com",
  updatedAt: "2024-04-09"
}

// En React:
const mutation = useMutation({
  mutationFn: (data) => apiPut(`/api/users/123`, data)
});

mutation.mutate({
  firstName: "Jean-Pierre",
  email: "jean.pierre@example.com"
});
```

#### 4. DELETE - Supprimer quelque chose

```typescript
// Demande : "Supprime l'utilisateur 123"
DELETE /api/users/123

// Réponse du serveur:
{
  message: "Utilisateur supprimé",
  id: 123
}

// En React:
const mutation = useMutation({
  mutationFn: () => apiDelete(`/api/users/123`)
});

mutation.mutate();
```

---

## Dialogues Réels - Exemples Concrets

### Exemple 1 : Afficher le profil d'un utilisateur

```
╔═══════════════════════════════════════════════════════════╗
║  L'UTILISATEUR NAVIGUE VERS /profile                      ║
╚═══════════════════════════════════════════════════════════╝

┌─ REACT (Frontend) ──────────────────────────────────────┐
│                                                            │
│  useEffect(() => {                                        │
│    const user = apiGet('/api/auth/me')  ← REQUÊTE        │
│  });                                                       │
│                                                            │
└────────────────────────────────────────────────────────┘
                         │
                         │ Envoie via INTERNET
                         ▼
┌─ SERVEUR (Backend) ────────────────────────────────────┐
│                                                            │
│  Reçoit: GET /api/auth/me                                │
│  ├─ Récupère l'ID de l'utilisateur (du token JWT)       │
│  ├─ Va chercher les données en base de données          │
│  ├─ Prépare la réponse                                  │
│  │                                                        │
│  Envoie back:                                            │
│  {                                                        │
│    id: "1",                                              │
│    firstName: "Jean",                                    │
│    lastName: "Dupont",                                   │
│    email: "jean@example.com",                            │
│    avatarUrl: "https://...",                             │
│    role: "MEMBER"                                        │
│  }                                                        │
│                                                            │
└────────────────────────────────────────────────────────┘
                         │
                         │ Reçoit via INTERNET
                         ▼
┌─ REACT (Frontend) ──────────────────────────────────────┐
│                                                            │
│  const { data: user } = useQuery({...})                 │
│  // data reçoit les données du serveur                   │
│                                                            │
│  Affichage:                                              │
│  <Avatar src={user.avatarUrl} />                        │
│  <h1>{user.firstName} {user.lastName}</h1>             │
│  <p>{user.email}</p>                                    │
│                                                            │
│  ✅ L'écran affiche le profil!                           │
│                                                            │
└────────────────────────────────────────────────────────┘
```

### Exemple 2 : Changer le mot de passe

```
╔═══════════════════════════════════════════════════════════╗
║  L'UTILISATEUR REMPLIT LE FORMULAIRE & CLIQUE             ║
║  "Changer le mot de passe"                                ║
╚═══════════════════════════════════════════════════════════╝

┌─ REACT (Frontend) ──────────────────────────────────────┐
│                                                            │
│  Formulaire rempli par l'utilisateur:                    │
│  currentPassword: "AncienMotDePasse123"                  │
│  newPassword: "NouveauMotDePasse456"                     │
│  confirmPassword: "NouveauMotDePasse456"                 │
│                                                            │
│  Validation React:                                        │
│  ✅ newPassword.length >= 6                              │
│  ✅ newPassword === confirmPassword                      │
│                                                            │
│  Envoie requête:                                         │
│  POST /api/auth/change-password                         │
│  Body: {                                                  │
│    currentPassword: "AncienMotDePasse123",              │
│    newPassword: "NouveauMotDePasse456"                  │
│  }                                                        │
│                                                            │
└────────────────────────────────────────────────────────┘
                         │
                         │ Envoie via INTERNET (HTTPS sécurisé)
                         ▼
┌─ SERVEUR (Backend) ────────────────────────────────────┐
│                                                            │
│  Reçoit: POST /api/auth/change-password                 │
│                                                            │
│  Vérifications:                                          │
│  ├─ Récupère l'utilisateur                              │
│  ├─ Vérifie currentPassword (compare avec hash en BD)   │
│  │  ❌ Si incorrect → Erreur 401: "Mot de passe erroné" │
│  │                                                        │
│  ├─ Vérifie que newPassword ≠ currentPassword           │
│  │  ❌ Si égal → Erreur: "Même mot de passe"            │
│  │                                                        │
│  ├─ Hash le newPassword (sécurité)                      │
│  ├─ Sauvegarde en base de données                       │
│  │                                                        │
│  Envoie réponse:                                         │
│  Status: 200 OK                                          │
│  {                                                        │
│    message: "Mot de passe changé avec succès"           │
│  }                                                        │
│                                                            │
└────────────────────────────────────────────────────────┘
                         │
                         │ Reçoit via INTERNET
                         ▼
┌─ REACT (Frontend) ──────────────────────────────────────┐
│                                                            │
│  const { mutate } = useMutation({                        │
│    onSuccess: () => {                                    │
│      notify('Mot de passe changé!', 'success')         │
│      reset()  // Vider le formulaire                     │
│    },                                                     │
│    onError: () => {                                      │
│      notify('Erreur!', 'error')                         │
│    }                                                      │
│  })                                                       │
│                                                            │
│  ✅ Affiche "Mot de passe changé!"                       │
│  ✅ Le formulaire est vidé                               │
│                                                            │
└────────────────────────────────────────────────────────┘
```

### Exemple 3 : Upload d'une photo de profil

```
╔═══════════════════════════════════════════════════════════╗
║  L'UTILISATEUR SÉLECTIONNE UNE IMAGE                      ║
╚═══════════════════════════════════════════════════════════╝

┌─ REACT (Frontend) ──────────────────────────────────────┐
│                                                            │
│  <input type="file" onChange={handleFileSelect} />       │
│                                                            │
│  // Utilisateur sélectionne: "photo.jpg" (2 MB)         │
│                                                            │
│  Validation React:                                        │
│  ✅ Type: image/jpeg                                     │
│  ✅ Taille < 5 MB                                        │
│                                                            │
│  Crée FormData:                                          │
│  const form = new FormData()                             │
│  form.append('file', file)  // L'image binaire           │
│                                                            │
│  Envoie requête:                                         │
│  POST /api/auth/avatar                                  │
│  Content-Type: multipart/form-data                      │
│  Body: [Données binaires de l'image]                    │
│                                                            │
│  Affiche "Upload en cours..." avec barre de progression  │
│                                                            │
└────────────────────────────────────────────────────────┘
                         │
                         │ Envoie via INTERNET (fichier binaire)
                         ▼
┌─ SERVEUR (Backend) ────────────────────────────────────┐
│                                                            │
│  Reçoit: POST /api/auth/avatar                          │
│  avec fichier image                                      │
│                                                            │
│  Traitement:                                             │
│  ├─ Récupère le fichier                                 │
│  ├─ Valide (est-ce vraiment une image?)                 │
│  ├─ Redimensionne l'image (ex: 200x200)                 │
│  ├─ Sauvegarde sur le disque ou cloud (S3)             │
│  │  Exemple: /uploads/avatars/user1_2024.jpg           │
│  ├─ Sauvegarde l'URL en base de données                 │
│  │  UPDATE users SET avatarUrl = '...' WHERE id = 1    │
│  │                                                        │
│  Envoie réponse:                                         │
│  Status: 200 OK                                          │
│  {                                                        │
│    id: "1",                                              │
│    firstName: "Jean",                                    │
│    avatarUrl: "https://cdn.example.com/avatars/1.jpg"   │
│  }                                                        │
│                                                            │
└────────────────────────────────────────────────────────┘
                         │
                         │ Reçoit via INTERNET
                         ▼
┌─ REACT (Frontend) ──────────────────────────────────────┐
│                                                            │
│  const { mutate } = useMutation({                        │
│    onSuccess: (updatedUser) => {                         │
│      // updatedUser.avatarUrl = nouvelle URL             │
│      // React re-render automatiquement                  │
│      <Avatar src={updatedUser.avatarUrl} />            │
│      notify('Photo mise à jour!', 'success')           │
│    }                                                      │
│  })                                                       │
│                                                            │
│  ✅ L'avatar change à l'écran!                           │
│  ✅ Message "Photo mise à jour!"                         │
│                                                            │
└────────────────────────────────────────────────────────┘
```

---

## Structure d'une requête API

### Parties d'une requête

```
┌─────────────────────────────────────────────────────────┐
│         REQUÊTE HTTP COMPLÈTE                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. METHOD (Méthode)                                    │
│     ├─ GET                                              │
│     ├─ POST                                             │
│     ├─ PUT                                              │
│     └─ DELETE                                           │
│                                                          │
│  2. URL (Adresse)                                       │
│     └─ https://api.example.com/api/users/123           │
│                                                          │
│  3. HEADERS (En-têtes)                                  │
│     ├─ Content-Type: application/json                  │
│     ├─ Authorization: Bearer <TOKEN>                   │
│     └─ ...                                              │
│                                                          │
│  4. BODY (Données) - Optionnel                          │
│     └─ { firstName: "Jean", lastName: "Dupont" }       │
│                                                          │
│  5. QUERY PARAMS (Paramètres URL) - Optionnel          │
│     └─ ?page=1&size=10&sort=name                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Exemple concret avec tous les éléments

```typescript
// Requête complète:
PUT /api/users/123?includeDetails=true
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-Custom-Header: value

{
  firstName: "Jean",
  lastName: "Dupont"
}

// Parties:
// 1. METHOD = PUT
// 2. URL = /api/users/123
// 3. QUERY PARAMS = ?includeDetails=true
// 4. HEADERS = Content-Type, Authorization, X-Custom-Header
// 5. BODY = { firstName: "Jean", lastName: "Dupont" }
```

---

## Réponses du serveur

### Codes de statut HTTP

```
┌──────────────────────────────────────────────────────────┐
│ 2xx = ✅ Succès                                           │
├──────────────────────────────────────────────────────────┤
│ 200 = OK (La requête a réussi)                           │
│ 201 = Created (Une nouvelle ressource créée)            │
│ 204 = No Content (Succès, pas de données retournées)    │
├──────────────────────────────────────────────────────────┤
│ 4xx = ❌ Erreur Client (Votre faute)                     │
├──────────────────────────────────────────────────────────┤
│ 400 = Bad Request (Données invalides)                   │
│ 401 = Unauthorized (Pas connecté / Token expiré)        │
│ 403 = Forbidden (Connecté mais pas autorisé)            │
│ 404 = Not Found (La ressource n'existe pas)             │
├──────────────────────────────────────────────────────────┤
│ 5xx = ⚠️  Erreur Serveur (Pas votre faute)              │
├──────────────────────────────────────────────────────────┤
│ 500 = Internal Server Error (Erreur du serveur)        │
│ 503 = Service Unavailable (Serveur en maintenance)     │
└──────────────────────────────────────────────────────────┘
```

### Exemple de réponse d'erreur

```typescript
// Requête:
POST /api/users
{ firstName: "", email: "invalide" }

// Réponse du serveur:
Status: 400 Bad Request
{
  error: "Validation Error",
  details: [
    { field: "firstName", message: "Minimum 2 caractères" },
    { field: "email", message: "Email invalide" }
  ]
}

// En React:
mutation.mutate(data, {
  onError: (error) => {
    const msg = error.response.data.details[0].message
    notify(msg, 'error')  // Affiche "Minimum 2 caractères"
  }
})
```

---

## Code React Simplifié

### Exemple 1: GET - Afficher des données

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/shared/api/apiClient';

export function UserProfile() {
  // Requête GET
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiGet('/api/auth/me')  // ← Appel API
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur!</p>;

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Exemple 2: POST - Créer quelque chose

```typescript
import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/apiClient';
import { useSnackbar } from '@/app/providers/SnackbarContext';

export function CreateUserForm() {
  const notify = useSnackbar();

  // Mutation POST
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => apiPost('/api/users', formData),  // ← Appel API
    onSuccess: () => {
      notify('Utilisateur créé!', 'success');
    },
    onError: (error) => {
      notify(error.message, 'error');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envoie données
    mutate({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Prénom" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Création...' : 'Créer'}
      </button>
    </form>
  );
}
```

### Exemple 3: PUT - Modifier

```typescript
import { useMutation } from '@tanstack/react-query';
import { apiPut } from '@/shared/api/apiClient';

export function EditUserForm({ userId }) {
  const { mutate, isPending } = useMutation({
    mutationFn: (updatedData) =>
      apiPut(`/api/users/${userId}`, updatedData)  // ← Appel API avec ID
  });

  const handleSave = (newData) => {
    mutate(newData);  // PUT /api/users/123
  };

  return (
    <button onClick={() => handleSave({ firstName: 'Alice' })}>
      {isPending ? 'Enregistrement...' : 'Enregistrer'}
    </button>
  );
}
```

### Exemple 4: DELETE - Supprimer

```typescript
import { useMutation } from '@tanstack/react-query';
import { apiDelete } from '@/shared/api/apiClient';

export function DeleteUserButton({ userId }) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => apiDelete(`/api/users/${userId}`)  // ← Appel API
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending ? 'Suppression...' : 'Supprimer'}
    </button>
  );
}
```

---

## Erreurs et Problèmes

### Problème 1: 401 Unauthorized

```
❌ Erreur: 401 Unauthorized
Cause: Vous n'êtes pas connecté ou le token JWT a expiré

Solution:
├─ apiClient.ts détecte automatiquement 401
├─ Redirige vers /login
└─ Vous devez vous reconnecter
```

### Problème 2: 404 Not Found

```
❌ Erreur: 404 Not Found
Cause: L'endpoint n'existe pas

Vérifications:
├─ Vérifier le chemin: /api/users vs /api/user (pluriel?)
├─ Vérifier la méthode: GET vs POST?
└─ Contacter l'équipe backend
```

### Problème 3: Données non mises à jour

```
❌ L'écran n'affiche pas les nouveaux données après un POST

Cause: Oubli d'invalider le cache React Query

Solution:
const { mutate } = useMutation({
  mutationFn: (data) => apiPost('/api/users', data),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['users'] })  // ← IMPORTANT!
  }
})
```

### Problème 4: Erreur CORS

```
❌ Erreur: No 'Access-Control-Allow-Origin' header
Cause: Le backend n'autorise pas les requêtes du frontend

C'est un problème BACKEND (serveur Spring Boot)
Le backend doit ajouter:
  @CrossOrigin(origins = "http://localhost:3000")
```

---

## Résumé Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                   LE CYCLE COMPLET DE L'API                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ÉTAPE 1: Utilisateur interagit          ÉTAPE 2: React collecte     │
│  ┌─────────────────┐                     ┌──────────────────┐        │
│  │ Clique bouton   │                     │ Données formulaire        │
│  └─────────────────┘                     └──────────────────┘        │
│           │                                        │                 │
│           └────────────────┬─────────────────────┘                  │
│                            ▼                                         │
│                  ÉTAPE 3: Validation                                │
│                  ┌──────────────────────┐                           │
│                  │ Zod validation       │                           │
│                  │ Min caractères?      │                           │
│                  │ Format email OK?     │                           │
│                  └──────────────────────┘                           │
│                            │                                         │
│           ┌────────────────┴────────────────┐                       │
│           │                                 │                       │
│           ▼                                 ▼                       │
│      ✅ Valide                          ❌ Erreur                   │
│      Continuer...                       Affiche message              │
│           │                                 │                       │
│           ▼                                 ▼                       │
│  ÉTAPE 4: Envoyer REQUÊTE API       Utilisateur corrige             │
│  ┌──────────────────────────────┐                                  │
│  │ POST /api/users              │                                  │
│  │ Content-Type: application/json│                                  │
│  │ Authorization: Bearer <TOKEN> │                                  │
│  │ Body: { firstName, lastName }│                                  │
│  └──────────────────────────────┘                                  │
│           │                                                          │
│           ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              🌐 INTERNET 🌐                                   │  │
│  │     Envoi des données au serveur (sécurisé HTTPS)           │  │
│  └─────────────────────────────────────────────────────────────┘  │
│           │                                                          │
│           ▼                                                          │
│  ÉTAPE 5: Serveur traite                                          │
│  ┌──────────────────────────────┐                                  │
│  │ Reçoit POST /api/users       │                                  │
│  │ Valide données               │                                  │
│  │ Sauvegarde en BD             │                                  │
│  │ Prépare réponse              │                                  │
│  └──────────────────────────────┘                                  │
│           │                                                          │
│           ▼                                                          │
│  ÉTAPE 6: Serveur envoie RÉPONSE                                  │
│  ┌──────────────────────────────┐                                  │
│  │ Status: 200 OK               │                                  │
│  │ Body: { id: 1, firstName,... }│                                 │
│  └──────────────────────────────┘                                  │
│           │                                                          │
│           ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              🌐 INTERNET 🌐                                   │  │
│  │     Retour des données au frontend (sécurisé HTTPS)         │  │
│  └─────────────────────────────────────────────────────────────┘  │
│           │                                                          │
│           ▼                                                          │
│  ÉTAPE 7: React reçoit                                            │
│  ┌──────────────────────────────┐                                  │
│  │ onSuccess() exécuté          │                                  │
│  │ Message: "Créé avec succès!" │                                  │
│  │ Cache invalidé               │                                  │
│  │ UI mise à jour               │                                  │
│  └──────────────────────────────┘                                  │
│           │                                                          │
│           ▼                                                          │
│  ÉTAPE 8: Affichage final                                         │
│  ┌──────────────────────────────┐                                  │
│  │ ✅ Notification "Succès!"    │                                  │
│  │ 📋 Données affichées à l'écran│                                 │
│  │ 🔄 Page mise à jour          │                                  │
│  │ Utilisateur satisfait! 😊     │                                 │
│  └──────────────────────────────┘                                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📌 Résumé - À Retenir

| Concept | Explication |
|---------|-----------|
| **API** | Communication entre 2 applications (React ↔ Serveur) |
| **Endpoint** | Une adresse spécifique sur le serveur (`/api/users/123`) |
| **GET** | Récupérer des données (lecture) |
| **POST** | Créer une nouvelle ressource |
| **PUT** | Modifier une ressource existante |
| **DELETE** | Supprimer une ressource |
| **Status 200** | ✅ Succès |
| **Status 401** | ❌ Pas connecté / Token expiré |
| **Status 404** | ❌ Ressource non trouvée |
| **JWT Token** | Authentification (prouve qu'on est connecté) |
| **Query** | Récupérer des données (useQuery) |
| **Mutation** | Modifier des données (useMutation) |

---

## 🎓 Prochaines Étapes

1. **Comprendre votre backend** - Quels endpoints existent?
   - Demander la documentation API
   - Ou explorer avec un outil comme Postman

2. **Tester les endpoints** - Avec Postman ou Thunder Client
   - Vérifier qu'ils marchent
   - Voir les réponses

3. **Implémenter en React** - Créer les appels API
   - Utiliser useQuery et useMutation
   - Gérer les erreurs

4. **Tester l'intégration** - Bout à bout
   - Cliquer sur un bouton
   - Voir les données changées

---

**Vous avez des questions? Demandez!** 🚀
