# RailMoPlus
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/TCMB-Project/rail_mo_plus)  
[日本語版](https://github.com/TCMB-Project/rail_mo_plus/blob/main/README.jpn.md)  
> **Note:** This document is a translation of the original Japanese README. Some translations may not be perfect.
rail_movement for high-speed driving

# Usage
## 1. Installation
Copy the build directory into the scripts directory of your behavior pack.  
You can use a submodule to keep up with updates.
```shell
git submodule add https://github.com/TCMB-Project/rail_mo_plus.git
```
## 2. Import
For JavaScript:
```javascript
import { RailMoPlusEntity } from "./build/rail_mo_plus.js";
```
For TypeScript:
```typescript
import { RailMoPlusEntity } from "./build/rail_mo_plus.ts";
```

# Example
A sample where an entity called foo:bar always moves at 10km/h on rails:
```javascript
import { world } from "@minecraft/server";
import { RailMoPlusEntity } from "./build/rail_mo_plus.js";

const entities = new Map();

world.afterEvents.entitySpawn.subscribe((e) => {
  const entity = e.entity;
  const railInstance = new RailMoPlusEntity(entity);
  railInstance.setSpeed(10);
  entities.set(entity.id, railInstance);
});
```

# License
MIT License