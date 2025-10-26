# Profanity List (`profanity-list.txt`)

Este archivo contiene más de 200 palabras ofensivas (en español e inglés), una por línea, para la moderación de vocabulario en el frontend.

## 📂 Ruta

```
frontend/public/moderation/profanity-list.txt
```

## 🚦 Ejemplo de carga en React/TypeScript

Puedes cargar la lista de esta manera (por ejemplo, en un hook o utilitario):

```typescript
export async function loadProfanityList(): Promise<string[]> {
  const response = await fetch('/moderation/profanity-list.txt');
  const text = await response.text();
  return text.split('\n').map(w => w.trim()).filter(Boolean);
}
```

- Úsalo para validar entradas de usuario en formularios, chats, publicaciones, etc.
- Si cambias la ruta del archivo, ajusta la URL en el fetch.

## 📄 Observaciones

- Mantén este archivo actualizado si necesitas agregar o quitar palabras.
- Si tienes integración con backend, asegúrate de mantener ambas listas sincronizadas si es necesario.