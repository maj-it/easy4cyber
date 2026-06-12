# 🦉 Easy4Cyber — Plateforme GRC & Audit Cybersécurité

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Référentiels](https://img.shields.io/badge/référentiels-ISO27001%20%7C%20NIST%20%7C%20RGPD-blue)
![IA](https://img.shields.io/badge/IA-Qwen2.5--coder%3A7b-green)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-orange)

> Plateforme d'audit cybersécurité intelligente permettant d'évaluer la conformité d'une organisation selon les principaux référentiels internationaux, avec analyse IA intégrée.

---

## 🎯 Fonctionnalités

| Module | Description |
|--------|-------------|
| 🔐 **Authentification** | Login sécurisé avec gestion des rôles (RSSI, Auditeur) |
| 📋 **Audits multi-référentiels** | ISO 27001:2022, NIST CSF 2.0, RGPD |
| 📊 **Scoring automatique** | Score global, par domaine, niveau de maturité (0→100%) |
| 🤖 **Analyse IA** | Qwen2.5-coder:7b via Ollama — analyse, recommandations, plan d'actions |
| 🗺️ **Cartographie des risques** | Matrice Impact × Probabilité 5×5 |
| 📄 **Export PDF** | Rapport professionnel multi-pages avec radar chart et logo |
| 📊 **Export Excel** | 4 onglets : résumé, réponses, plan d'actions, analyse IA |
| 🏢 **Recherche entreprises** | Auto-complétion via API Sirene INSEE (SIRET, NAF, adresse) |
| 💬 **Chatbot flottant** | Assistant IA accessible sur toutes les pages |
| 📈 **Dashboard RSSI** | KPIs animés, radar, évolution temporelle |

---

## 🛠️ Stack Technique

- **Front-end** : React 18 + Vite + Tailwind CSS
- **State** : Zustand + localStorage
- **Charts** : Recharts (Radar, Bar, Line)
- **IA** : Ollama + Qwen2.5-coder:7b (local)
- **Export** : jsPDF + jspdf-autotable + SheetJS
- **API** : Sirene INSEE (recherche entreprises)

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- [Ollama](https://ollama.ai) avec le modèle `qwen2.5-coder:7b`

```bash
# 1. Clone
git clone https://github.com/maj-it/easy4cyber.git
cd easy4cyber

# 2. Install
npm install

# 3. Lance Ollama
ollama run qwen2.5-coder:7b

# 4. Démarre l'app
npm run dev
```

Ouvre **http://localhost:5173**

---

## 🔑 Comptes de démonstration

| Login | Mot de passe | Rôle |
|-------|-------------|------|
| `admin` | `easy4cyber` | RSSI |
| `auditeur` | `audit2026` | Auditeur |

---

## 📐 Référentiels disponibles

- **ISO 27001:2022** — 37 contrôles, 9 domaines
- **NIST CSF 2.0** — 19 contrôles, 6 fonctions (GV, ID, PR, DE, RS, RC)
- **RGPD** — 18 contrôles, 5 domaines

---

## 📸 Screenshots

> Dashboard RSSI • Questionnaire d'audit • Radar de maturité • Rapport PDF • Cartographie des risques

---

## 👤 Auteur

**MAJ-IT** — Freelance Dev & Cybersécurité  
 • [LinkedIn](https://linkedin.com/in/flore-maj)

---

*Projet réalisé dans le cadre d'un rattrapage cybersécurité — Flore Majeu -- INSTA Paris 2026*
