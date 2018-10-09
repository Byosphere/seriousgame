# Suivi de développement du Serious Game Orange Labs

## Table of Contents

- [Structure de fichiers](#structure-de-fichiers)
- [Données modifiables](#données-modifiables)
- [Réunions](#réunions)


## Structure de fichiers

## Données modifiables
### Roles
```javascript
{
  "roles": [
        {
            "id": 1,
            "name": "Role Fictif 1",
            "description": "lorem isdfoiqsdhf qlksdjqkldj qksl jqslk jqks jqld",
            "disabled": false
        }
   ]
}
```

### Stories
```javascript
{
    "stories": [
        {
            "id": 1,
            "name": "Story 1",
            "description": "Story test pour commencer",
            "nbPlayers": 2,
            "roles": [
                1,
                2
            ],
            "interfaces": [
                {
                    "roleId": 1,
                    "cols": 6,
                    "rows": 6,
                    "pages": [
                        {
                            "id": 1,
                            "background": "./image.png",
                            "components": [
                                {
                                    "id": "composant1",
                                    "onclick": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "roleId": 2,
                    "cols": 6,
                    "rows": 6,
                    "pages": [
                        {
                            "id": 2,
                            "background": "./image.png",
                            "components": [
                                {
                                    "id": "composant1",
                                    "onclick": "action1"
                                }
                            ]
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "id": "action1"
                    "name": "Lancer l'event X",
                    "description": "Lorem ipsum"
                }
            ]
        }
    ]
}
```
## Réunions

### Compte rendu du 08/10/2018
Points abordés :
- Mise en place de la structure des composants en "grille"
- Ajout des boutons "reset" et "play/pause"
- Discussion sur le suivi des actions/pages pour le maitre du jeu -> à creuser


This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
