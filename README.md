# Projet OuiTransfer

Bienvenue dans le projet **OuiTransfer** ! Ce projet est une application web développée en utilisant des technologies modernes. 

## Technologies Utilisées

### Backend
- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **JWT (JSON Web Token)**

### Frontend
- **React**
- **TypeScript**
- **Evergreen**
- **Vite**

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

Pour installer les dépendances de développement, vous pouvez utiliser le Makefile fourni. Voici comment procéder :

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/MattisAvec2T/oui-transfer.git
    cd oui-transfer
    ```

2. Créez le fichier `.env` en exécutant la commande suivante :
    ```bash
    make env
    ```

3. **(Optionnel)** Vous pouvez créer les *node_modules* pour le backend et le frontend pour dev sur l'application :
    ```bash
    make package
    ```

## Commandes Docker

Voici les principales commandes Docker que vous pouvez utiliser pour gérer l'application :

- **Construire les images Docker :**
    ```bash
    make build
    ```

- **Lancer les conteneurs en arrière-plan :**
    ```bash
    make up
    ```
  Vous pouvez accéder à l'application client à l'adresse : [http://localhost:5173](http://localhost:5173) et au serveur à l'adresse : [http://localhost:3000](http://localhost:3000).

- **Arrêter les conteneurs :**
    ```bash
    make down
    ```

- **Redémarrer les conteneurs :**
    ```bash
    make restart
    ```

- **Nettoyer les images Docker :**
    ```bash
    make clean
    ```

## Accès aux Terminaux

Pour accéder aux terminaux des conteneurs, vous pouvez utiliser les commandes suivantes :

- **Terminal de la base de données :**
    ```bash
    make db-bash
    ```

- **Terminal du serveur :**
    ```bash
    make server-bash
    ```

- **Terminal du frontend :**
    ```bash
    make frontend-bash
    ```

## Contributeurs

Merci aux contributeurs qui ont participé à ce projet :

- [Mattis Almeida Lima](https://github.com/MattisAvec2T)
- [Faustine Charrier](https://github.com/Nyoote)