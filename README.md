# TaPTaP Game Engine

JSON-driven modular game engine.

## Features

- JSON based configuration
- Modular system architecture
- Reusable game systems
- Lightweight and extensible

```
TAP-TAP ENGINE
│
├── config/
│     └── game-config.json        (optional global config)
│
├── engine/
│     ├── core/
│     │     └── engine.js         (game loop + execution)
│     │
│     ├── system/
│     │     ├── inputsystem.js    (captures user input)
│     │     ├── leaderboard.js    (Update Leaderboard)
│     │     ├── timersystem.js    (Handle Time)
│     │     └── scoresystem.js    (optional / reusable)
│     │
│     └── utils/
│           ├── apiclient.js    (Send LeaderBoard to Client)
│           └── configloader.js   (loads JSON config)
│
├── game/
│     ├── sudoku/
│     │     ├── game.js           (sudoku logic)
│     │     ├── level1.json
│     │     ├── level2.json
│     │     └── level3.json
│     │
│     └── Tap/
│           ├── game.js           (tap game logic)
│           ├── level1.json
│           ├── level2.json
│           └── level3.json
│
├── examples/
│     └── demo.js
│     └── sampleGame.js
│     └── DEMO_RUN.ms
│
├── Prototype.md
├── runner.js        (entry point)               
├── README.md
├── package.json
└── .gitignore
```
## Game Engine Blueprint
```
                +----------------------+
                |     Game JSON        |
                | (Game Definition)    |
                +----------+-----------+
                           |
                           v
+------------------------------------------------+
|                GAME ENGINE CORE                |
|------------------------------------------------|
| Game Loader                                    |
| Game Renderer                                  |
| Timer Manager                                  |
| Score Manager                                  |
| Input Handler                                  |
| State Manager                                  |
+------------+------------------+----------------+
             |                  |
             v                  v

     +---------------+     +-----------------+
     | Game Plugins  |     | Leaderboard API |
     | Sudoku Game   |     | Submit Score    |
     | Word Builder  |     | Fetch Rankings  |
     +---------------+     +-----------------+

```
## UI Layout
```
----------------------------------
| TapTap Game Engine             |
----------------------------------
| Game Selector                  |
| [Sudoku] [Word Builder]        |
----------------------------------
| Timer        | Score           |
----------------------------------
|                                  |
|        GAME BOARD                |
|                                  |
----------------------------------
| Submit Score | Restart Game     |
----------------------------------
| Leaderboard                      |
----------------------------------
``


