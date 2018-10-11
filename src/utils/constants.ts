import { Story } from '../interfaces/Story';

export const INSTRUCTOR = 'instructor';
export const PLAYER = 'player';

export const ORANGE = '#ff7900';
export const HAUT = 'haut';
export const BAS = 'bas';

export const STORY_TEST: Story = {
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
            "displayIa" : true,
            "pages": [
                {
                    "id": 1,
                    "background": "./image.png",
                    "components": [
                        {
                            "name": "ImageClickable",
                            "rows": "1 / 2",
                            "cols": "1 / 2",
                            "actionToDisplay": "action1"
                        }
                    ]
                }
            ],
            "messages": [
                {
                    "text": "Message par défaut de l'ia pour tester",
                    "position": "haut",
                    "force": 1,
                },
                {
                    "text": "Message affiché lors du passage à l'action 1",
                    "position": "haut",
                    "force": 1,
                    "action": "action1"
                }
            ]
        },
        {
            "roleId": 2,
            "cols": 6,
            "rows": 6,
            "displayIa" : true,
            "pages": [
                {
                    "id": 2,
                    "background": "./image.png",
                    "components": [
                        {
                            "name": "ImageClickable",
                            "rows": "3 / 4",
                            "cols": "3 / 5",
                            "onclick": "action1"
                        }
                    ]
                }
            ]
        }
    ],
    "actions": [
        {
            "id": "action1",
            "name": "Une action 1",
            "description": "Action utilisée pour afficher tel composant",
            "masterOnly": true
        },
        {
            "id": "action2",
            "name": "Une action 2",
            "description": "Action utilisée pour afficher tel composant",
            "masterOnly": true
        },
        {
            "id": "action3",
            "name": "Une action 3",
            "description": "Action utilisée pour afficher tel composant",
            "masterOnly": true
        },
        {
            "id": "action4",
            "name": "Une action 4",
            "description": "Action utilisée pour afficher tel composant",
            "masterOnly": true
        },
        {
            "id": "action5",
            "name": "Une action 5",
            "description": "Action utilisée pour afficher tel composant",
            "masterOnly": true
        },
        {
            "id": "action6",
            "name": "Une action 6",
            "description": "Action utilisée pour afficher tel composant",
            "masterOnly": true
        }
    ]
};