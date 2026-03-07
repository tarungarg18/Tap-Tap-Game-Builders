# TaPTaP Game Engine Architecture

## Overview

TaPTaP Engine is a lightweight, JSON-driven game engine that lets students build simple games without writing complex game logic.

The engine separates configuration and execution.

Core idea:
JSON → Engine Parser → Systems → Game Loop → Render

---

## Architecture Diagram

```text
Game Config (JSON)
        |
        v
Config Loader + Validator
        |
        v
Engine Core (Boot + Lifecycle)
        |
        +--> Input System
        +--> Physics System
        +--> Render System
        +--> Score/Rule System
        |
        v
Central Game State
        |
        v
Frame Output + Runtime Events
```
## Runtime Lifecycle

1. Load and validate config.
2. Initialize systems and base entities.
3. Start game loop.
4. Process frame cycle until terminal state.
5. Emit result state and cleanup resources.

## Scalability and Reusability Strategy

- New game variants should be created by swapping config files.
- New gameplay features should be added as standalone systems.
- Core loop should remain unchanged across game types.
- Backward compatibility is maintained through config versioning.

