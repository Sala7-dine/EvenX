# 🎟️ EvenX

> Application web complète permettant de gérer des **événements**, des **réservations** et des **tickets PDF**, avec une gestion rigoureuse des rôles, de la sécurité et de l’industrialisation.

---

## 📌 Sommaire

* [🎯 Objectif du projet](#-objectif-du-projet)
* [🧑‍🤝‍🧑 Rôles utilisateurs](#-rôles-utilisateurs)
* [✨ Fonctionnalités](#-fonctionnalités)
* [🧱 Architecture technique](#-architecture-technique)
* [📊 Règles métier](#-règles-métier)
* [🧪 Tests](#-tests)
* [🐳 Docker & Déploiement](#-docker--déploiement)
* [⚙️ CI/CD](#️-cicd)
* [🚀 Installation](#-installation)
* [📂 Livrables](#-livrables)

---

## 🎯 Objectif du projet

Cette application a pour but de **centraliser et fiabiliser la gestion des événements** et des inscriptions, en remplaçant les outils manuels (Excel, e-mails, formulaires simples).

Elle permet notamment :

* une visibilité en temps réel des événements,
* une gestion fiable des réservations,
* une séparation claire des rôles et des responsabilités.

---

## 🧑‍🤝‍🧑 Rôles utilisateurs

| Rôle               | Description                                    |
| ------------------ | ---------------------------------------------- |
| 👑 **Admin**       | Gère les événements et valide les réservations |
| 🙋 **Participant** | Consulte les événements et réserve des places  |

---

## ✨ Fonctionnalités

### 👑 Admin

* ➕ Créer, modifier, publier et annuler des événements
* 📋 Consulter les réservations (par événement / participant)
* ✅ Confirmer ou ❌ refuser une réservation
* 📊 Visualiser des indicateurs (taux de remplissage, événements à venir)

### 🙋 Participant

* 👀 Consulter les événements publiés
* 📝 Réserver une place
* ❌ Annuler une réservation
* 📄 Télécharger un **ticket PDF** (si réservation confirmée)

---

## 🧱 Architecture technique

### 🔙 Back-end

| Élément          | Technologie           |
| ---------------- | --------------------- |
| Framework        | NestJS (TypeScript)   |
| Base de données  | PostgreSQL ou MongoDB |
| Authentification | JWT                   |
| Validation       | class-validator       |

Architecture modulaire :

* Modules
* Controllers
* Services
* DTO

---

### 🎨 Front-end

| Élément          | Technologie           |
| ---------------- | --------------------- |
| Framework        | Next.js + TypeScript  |
| Rendu            | SSR + CSR             |
| State management | Redux ou Context API  |
| Tests            | React Testing Library |

---

## 📊 Règles métier

### 📅 Événements

| Règle      | Description                  |
| ---------- | ---------------------------- |
| Statuts    | DRAFT, PUBLISHED, CANCELED   |
| Visibilité | Uniquement PUBLISHED         |
| Capacité   | Ne peut jamais être dépassée |

### 📝 Réservations

| Règle   | Description                                  |
| ------- | -------------------------------------------- |
| Statuts | PENDING, CONFIRMED, REFUSED, CANCELED        |
| Unicité | Une seule réservation active par participant |
| PDF     | Téléchargeable uniquement si CONFIRMED       |

---

## 🧪 Tests

### 🔙 Back-end

* ✅ Tests unitaires (Jest)
* 🔄 Tests end-to-end (scénario complet)

### 🎨 Front-end

* 🧩 Tests de composants
* 🔁 Tests de flux fonctionnels

---

## 🐳 Docker & Déploiement

* 🐳 Dockerfile Front-end
* 🐳 Dockerfile Back-end
* 🗄️ Base de données containerisée
* 🔗 Communication via Docker network

Fichier requis :

* `docker-compose.yml`

---

## ⚙️ CI/CD

Pipeline **GitHub Actions** :

| Étape       | Statut |
| ----------- | ------ |
| Install     | ✅      |
| Lint        | ✅      |
| Tests       | ✅      |
| Build       | ✅      |
| Docker Push | ✅      |

🔴 La pipeline échoue si une étape échoue.

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-repo.git

# Lancer avec Docker
docker-compose up --build
```

Fichier requis :

* `.env.example`

---

## 📂 Livrables

* 📦 Code source
* 🔗 Lien GitHub
* 📘 Documentation technique
* 📐 Diagramme de classes
* 🧪 Tests automatisés

---

✨ **Projet réalisé dans un contexte pédagogique (5 jours)**

📅 Lancement : 02/02/2026
⏰ Deadline : 06/02/2026

---

💡 *Application conçue avec une attention particulière portée à la qualité du code, à la sécurité et à la maintenabilité.*
