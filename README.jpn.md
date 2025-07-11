# RailMoPlus
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/TCMB-Project/rail_mo_plus)  
高速走行に対応したrail_movement

# 使い方
## 1. インストール
ビヘイビアパックのscriptsディレクトリにbuildディレクトリをコピーしてください。  
サブモジュールを使用することで、更新を追従できます。
```shell
git submodule add https://github.com/TCMB-Project/rail_mo_plus.git
```
## 2. インポート
JavaScriptの場合
```javascript
import { RailMoPlusEntity } from "./build/rail_mo_plus.js";
```
TypeScriptの場合
```typescript
import { RailMoPlusEntity } from "./build/rail_mo_plus.ts";
```

# 使用例
foo:barというエンティティがレール上を常に10km/hで移動するサンプル
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

# ライセンス
MIT License