export const INSTRUCTOR = 'instructor';
export const PLAYER = 'player';

export const ORANGE = '#ff7900';

export const STORY_TEST = {
    "id": 1,
    "name": "Story 1",
    "description": "Story test pour commencer",
    "nbPlayers": 3,
    "roles": [
        1,
        2,
        3
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
                            "action": ""
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
                            "action": "action1"
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
                            "action": "action1"
                        }
                    ]
                }
            ]
        }
    ],
    "actions": [
        {
            "id": "action1",
            "name": "action1",
            "description": "action1",
        }
    ]
};