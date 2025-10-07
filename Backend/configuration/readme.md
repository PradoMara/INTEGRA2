# Profanity List (`profanity-list.txt`)

Este archivo contiene más de 200 palabras ofensivas (en español e inglés), una por línea, para la moderación de vocabulario en el backend.

## 📂 Ruta

```
Backend/moderation/profanity-list.txt
```

## 🚦 Ejemplo de carga en Node.js/TypeScript

Asegúrate de tener instalado `@types/node` y tener `"module": "commonjs"` en tu `tsconfig.json`.

```typescript
import * as fs from 'fs';
import * as path from 'path';

export function loadProfanityList(): string[] {
  const filePath = path.join(__dirname, '../moderation/profanity-list.txt');
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').map((w: string) => w.trim()).filter(Boolean);
}
```

- Puedes usar esta función para cargar la lista y filtrar mensajes en chats, publicaciones u otros módulos del backend.
- Si cambias la ubicación del archivo, ajusta la ruta en el código.

## 📄 Observaciones

- Mantén este archivo actualizado si necesitas agregar o quitar palabras.
- Si tienes integración con frontend, asegúrate de mantener ambas listas sincronizadas si es necesario.