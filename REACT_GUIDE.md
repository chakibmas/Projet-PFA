# 🚀 Guide Complet React – Concepts Essentiels

## 📌 Table des Matières
1. [Qu'est-ce que React ?](#quest-ce-que-react-)
2. [Concepts Fondamentaux](#concepts-fondamentaux)
3. [Composants](#composants)
4. [JSX](#jsx)
5. [Props](#props)
6. [State (État)](#state-état)
7. [Hooks](#hooks)
8. [Cycle de Vie](#cycle-de-vie)
9. [Rendering & Virtual DOM](#rendering--virtual-dom)
10. [Patterns & Bonnes Pratiques](#patterns--bonnes-pratiques)

---

## Qu'est-ce que React ?

**React** est une **librairie JavaScript** (pas un framework complet) créée par Meta pour construire des interfaces utilisateur (UI) dynamiques et interactives.

### Caractéristiques clés :
- ✅ **Déclaratif** → Tu décris ce que tu veux, React le rend
- ✅ **Basé sur les composants** → Réutilisabilité maximale
- ✅ **Réactif** → Mise à jour automatique de l'UI quand les données changent
- ✅ **Unidirectionnel** → Flux de données prévisible

### Pourquoi React ?
```javascript
// ❌ Vanilla JavaScript (impératif)
const button = document.getElementById('btn');
button.addEventListener('click', () => {
  count++;
  document.getElementById('count').textContent = count;
});

// ✅ React (déclaratif)
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

React **gère automatiquement** les mises à jour du DOM. Tu décris l'UI, React la rend.

---

## Concepts Fondamentaux

### 1️⃣ **Composants**
Un **composant** est une fonction (ou classe) qui retourne du JSX.

```javascript
// Composant fonction (moderne ✅)
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Composant classe (ancien ❌)
class Welcome extends React.Component {
  render() {
    return <h1>Hello, World!</h1>;
  }
}
```

**Types de composants :**
- **Fonction** → Plus rapide, moderne (à préférer)
- **Classe** → Ancien, lourd (éviter)

---

### 2️⃣ **Props (Propriétés)**
Les **props** sont des paramètres qu'on passe aux composants. Elles sont **immutables** (en lecture seule).

```javascript
// Définition avec props
function Greeting({ name, age }) {
  return <p>Hello {name}, you are {age} years old</p>;
}

// Utilisation
<Greeting name="Alice" age={25} />
// Output: "Hello Alice, you are 25 years old"

// Destructuration (meilleure pratique)
function Card({ title, description, children }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}

<Card title="My Card" description="Cool stuff">
  <button>Click me</button>
</Card>
```

**Règles des props :**
- ✅ Les passer du parent au enfant
- ❌ Ne jamais modifier une prop directement
- ✅ Utiliser des valeurs par défaut

```javascript
function Counter({ initialCount = 0 }) {
  // Si initialCount n'est pas passé, par défaut = 0
  return <p>Count: {initialCount}</p>;
}
```

---

### 3️⃣ **State (État)**
L'**état** est une donnée locale d'un composant qui peut **changer** et **déclencher un rendu**.

```javascript
import { useState } from 'react';

function Counter() {
  // state = 0, setState = fonction pour le modifier
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

**Différence Props vs State :**

| Props | State |
|-------|-------|
| Données **du parent** | Données **locales** |
| **En lecture seule** | **Modifiable** |
| Ne déclenche pas rendu enfant | Déclenche rendu du composant |
| Passées en paramètre | Créées avec `useState` |

---

## JSX

**JSX** = JavaScript + XML/HTML. Permet d'écrire du HTML dans du JavaScript.

```javascript
// JSX ✅
function App() {
  const name = "Alice";
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>Welcome to React</p>
    </div>
  );
}

// Compile en JavaScript ⬇️
function App() {
  const name = "Alice";
  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Hello ', name),
    React.createElement('p', null, 'Welcome to React')
  );
}
```

### Syntaxe JSX importante :

```javascript
function Example() {
  const isActive = true;
  const items = ['Apple', 'Banana', 'Orange'];

  return (
    <div>
      {/* Expressions JavaScript */}
      <p>{2 + 2}</p>
      <p>{isActive ? 'Active' : 'Inactive'}</p>

      {/* Conditionnels */}
      {isActive && <p>You are logged in</p>}

      {/* Boucles */}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Attributs */}
      <button disabled={!isActive} className="btn">Click</button>
      <input placeholder="Enter name" value="John" onChange={handleChange} />
    </div>
  );
}
```

**Règles importantes :**
- ✅ Utiliser `className` au lieu de `class`
- ✅ Utiliser `htmlFor` au lieu de `for`
- ✅ Les clés (key) pour les listes (aident React à identifier les éléments)
- ✅ Les événements en camelCase : `onClick`, `onChange`, `onSubmit`

---

## Props

Les props permettent la **communication parent → enfant**.

```javascript
// Composant parent
function ParentComponent() {
  const user = { name: 'Bob', age: 30 };

  return (
    <ChildComponent
      user={user}
      title="User Info"
      onUpdate={() => console.log('Updated')}
    />
  );
}

// Composant enfant
function ChildComponent({ user, title, onUpdate }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
}
```

### Spread Operator (Passz rassemble des props)

```javascript
function Button({ color, size, ...rest }) {
  return <button style={{ color, fontSize: size }} {...rest} />;
}

// Utilisation
<Button color="blue" size="16px" className="custom" disabled>
  Click
</Button>
```

---

## State (État)

### useState Hook

```javascript
import { useState } from 'react';

function FormExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    console.log({ name, email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Envoyer</button>
      {submitted && <p>Merci !</p>}
    </form>
  );
}
```

### State complexe (objet)

```javascript
function Todo() {
  const [todo, setTodo] = useState({
    id: 1,
    text: 'Learn React',
    completed: false
  });

  // ✅ Bonne façon : spread operator + mise à jour immuable
  function toggleTodo() {
    setTodo({
      ...todo,
      completed: !todo.completed
    });
  }

  // ❌ Mauvaise façon : modification directe
  function badToggle() {
    todo.completed = !todo.completed; // Ne déclenche pas rendu !
    setTodo(todo);
  }

  return (
    <div>
      <p>{todo.text} - {todo.completed ? '✅' : '❌'}</p>
      <button onClick={toggleTodo}>Toggle</button>
    </div>
  );
}
```

---

## Hooks

Les **Hooks** sont des fonctions qui permettent d'utiliser des fonctionnalités React dans les composants fonction.

### Règles des Hooks :
1. ✅ Appeler **seulement dans un composant fonction**
2. ✅ Appeler **au niveau supérieur** (pas dans des boucles/conditions)
3. ✅ Créer des hooks personnalisés si besoin

### Les Hooks les plus courants :

#### 1. `useState` - Gérer l'état local
```javascript
const [value, setValue] = useState(initialValue);
```

#### 2. `useEffect` - Effets de bord (API call, souscrire...)

```javascript
import { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exécuté après le rendu (comme componentDidMount)
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // Dépendances vides = exécuté UNE FOIS au montage

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Dépendances important :**
```javascript
// ✅ Exécuté UNE FOIS au montage
useEffect(() => {
  console.log('Component mounted');
}, []);

// ✅ Exécuté à CHAQUE rendu
useEffect(() => {
  console.log('Component re-rendered');
});

// ✅ Exécuté quand `count` change
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// ✅ Cleanup function (comme componentWillUnmount)
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

#### 3. `useRef` - Référence mutable persistante

```javascript
import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus Input</button>
    </>
  );
}
```

#### 4. `useContext` - Passer les données globales

```javascript
import { createContext, useContext } from 'react';

// Créer le contexte
const ThemeContext = createContext();

// Provider (au niveau racine)
function App() {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      <Header />
    </ThemeContext.Provider>
  );
}

// Utiliser le contexte dans n'importe quel composant enfant
function Header() {
  const { theme } = useContext(ThemeContext);
  return <header style={{ background: theme }}>Header</header>;
}
```

#### 5. `useReducer` - État complexe avec actions

```javascript
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

#### 6. `useMemo` & `useCallback` - Optimisation

```javascript
import { useMemo, useCallback } from 'react';

function ExpensiveCalculation({ items }) {
  // ✅ Calcul expensive fait qu'une fois si `items` change
  const total = useMemo(() => {
    console.log('Calculating...');
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  // ✅ Fonction mémorisée, pas créée à chaque rendu
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return (
    <div>
      <p>Total: {total}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

---

## Cycle de Vie

### Composants Fonction (avec Hooks)

```javascript
function LifecycleExample() {
  const [count, setCount] = useState(0);

  // Montage (componentDidMount)
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted'); // Cleanup
  }, []);

  // Mise à jour (componentDidUpdate)
  useEffect(() => {
    console.log('Component updated (count)', count);
  }, [count]);

  // Toujours exécuté
  useEffect(() => {
    console.log('Component re-rendered');
  });

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

**Ordre d'exécution :**
1. **Rendu** → JSX est converti en DOM
2. **useEffect** → Exécuté après rendu
3. **Cleanup** → Avant le prochain effet

---

## Rendering & Virtual DOM

### Comment fonctionne React ?

```
1. State change
   ↓
2. Re-render (crée virtual DOM)
   ↓
3. Reconciliation (diff avec ancien virtual DOM)
   ↓
4. Update DOM (change seulement les éléments modifiés)
   ↓
5. Affichage à l'écran
```

### Exemple concret :

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      {/* Seulement ce texte sera re-rendu */}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// Au click :
// 1. setState(1)
// 2. Re-render avec count=1
// 3. Virtual DOM détecte que le <p> a changé
// 4. React update SEULEMENT le <p> dans le DOM réel
// 5. Le <button> n'est pas re-créé
```

### Performance - Keys dans les listes

```javascript
// ❌ Mauvais : sans key ou index comme key
{todos.map((todo, index) => (
  <TodoItem key={index} {...todo} />
))}

// ✅ Bon : chaque item a un ID unique
{todos.map(todo => (
  <TodoItem key={todo.id} {...todo} />
))}
```

Quand `key` change, React **récrée** complètement l'élément (nouveau state, re-initialise).

---

## Patterns & Bonnes Pratiques

### 1. Composition plutôt qu'héritage

```javascript
// ✅ Composition (React way)
function Button({ variant, children }) {
  const style = variant === 'primary' ? { bg: 'blue' } : { bg: 'gray' };
  return <button style={style}>{children}</button>;
}

// Utilisation
<Button variant="primary">Click me</Button>

// ❌ Héritage (à éviter)
class PrimaryButton extends Button {
  // ...
}
```

### 2. Lifting State Up (État partagé)

```javascript
// ❌ État séparé dans 2 composants
function TemperatureInput1() {
  const [temp, setTemp] = useState(0);
  return <input value={temp} onChange={(e) => setTemp(e.target.value)} />;
}

// ✅ État remontés au parent
function TemperatureCalculator() {
  const [celsius, setCelsius] = useState(0);

  function handleChange(e) {
    setCelsius(e.target.value);
  }

  const fahrenheit = (celsius * 9/5) + 32;

  return (
    <div>
      <input value={celsius} onChange={handleChange} />
      <p>Fahrenheit: {fahrenheit}</p>
    </div>
  );
}
```

### 3. Render Props Pattern

```javascript
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
}

// Utilisation
<Mouse render={({ x, y }) => (
  <p>Mouse position: {x}, {y}</p>
)} />
```

### 4. Custom Hook (Réutiliser la logique)

```javascript
// Custom Hook
function useFormInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    bind: {
      value,
      onChange: (e) => setValue(e.target.value)
    }
  };
}

// Utilisation
function LoginForm() {
  const username = useFormInput('');
  const password = useFormInput('');

  return (
    <form>
      <input {...username.bind} placeholder="Username" />
      <input {...password.bind} type="password" placeholder="Password" />
    </form>
  );
}
```

### 5. Error Boundary (Gestion erreurs)

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong</p>;
    }
    return this.props.children;
  }
}

// Utilisation
<ErrorBoundary>
  <ProblematicComponent />
</ErrorBoundary>
```

### 6. Code Splitting & Lazy Loading

```javascript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## 📊 Résumé Visuel

```
┌─────────────────────────────────┐
│      React Application          │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │  Components │
        └──────┬──────┘
               │
      ┌────────┴────────┐
      │                 │
   ┌──▼───┐        ┌───▼──┐
   │ Props│        │State │
   └──┬───┘        └───┬──┘
      │                 │
      │                 │ useEffect
      │                 │ useState
      │                 │ useRef
      │                 │ useContext
      │                 │ useReducer
      │
      └─────────┬───────┘
                 │
          ┌──────▼──────┐
          │     JSX     │
          └──────┬──────┘
                 │
        ┌────────▼────────┐
        │  Virtual DOM    │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Real DOM       │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   UI Rendered   │
        └─────────────────┘
```

---

## 🎓 À Retenir Absolument

| Concept | Explication |
|---------|-------------|
| **Composant** | Fonction qui retourne JSX |
| **Props** | Données du parent (immutables) |
| **State** | Données locales (modifiables) |
| **JSX** | HTML dans JavaScript |
| **Hooks** | Fonctions pour ajouter des fonctionnalités |
| **useEffect** | Exécuter code après rendu |
| **useState** | Modifier l'état local |
| **Virtual DOM** | Copie du DOM, React l'optimise automatiquement |
| **Key** | Identifiants uniques dans les listes |
| **Unidirectionnel** | Données parent → enfants (pas l'inverse) |

---

## 💡 Conseils Pratiques

1. **Penser en React** → Composants > Hiérarchie > État
2. **État au bon niveau** → Remonte l'état seulement si partagé
3. **Éviter mutations** → Toujours créer nouvelles instances
4. **Dependencies bien pensées** → Évite les bugs subtils
5. **DevTools** → Installer React DevTools extension
6. **Performance** → Profiler avant d'optimiser
7. **Testabilité** → Composants purs et prévisibles

---

## 🔗 Ressources Complémentaires

- [React Official Docs](https://react.dev)
- [React Patterns](https://reactpatterns.com/)
- [Hooks API Reference](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Dernière mise à jour : April 2024**
