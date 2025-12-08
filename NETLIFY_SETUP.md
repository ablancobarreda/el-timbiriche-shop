# Configuración de Netlify

Este documento explica cómo configurar y desplegar este proyecto en Netlify.

## Variables de Entorno Requeridas

En el panel de Netlify, ve a **Site settings > Environment variables** y agrega las siguientes variables:

### Variable Requerida:

- `NEXT_PUBLIC_LARAVEL_API_BASE_URL`: URL base de tu API Laravel
  - Ejemplo: `https://tu-api-laravel.com/api`
  - O para desarrollo local: `http://localhost:8000/api`

## Pasos para Desplegar

### Opción 1: Despliegue desde Git (Recomendado)

1. **Conecta tu repositorio a Netlify:**
   - Ve a [Netlify](https://app.netlify.com)
   - Haz clic en "Add new site" > "Import an existing project"
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket

2. **Configuración automática:**
   - Netlify detectará automáticamente que es un proyecto Next.js
   - El archivo `netlify.toml` ya está configurado con los valores correctos

3. **Agrega las variables de entorno:**
   - Ve a **Site settings > Environment variables**
   - Agrega `NEXT_PUBLIC_LARAVEL_API_BASE_URL` con el valor de tu API

4. **Despliega:**
   - Netlify iniciará el build automáticamente
   - El sitio estará disponible en una URL como `tu-sitio.netlify.app`

### Opción 2: Despliegue Manual

1. **Instala Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Inicia sesión:**
   ```bash
   netlify login
   ```

3. **Inicializa el sitio:**
   ```bash
   netlify init
   ```

4. **Despliega:**
   ```bash
   netlify deploy --prod
   ```

## Configuración del Build

El archivo `netlify.toml` ya está configurado con:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20
- **Plugin**: `@netlify/plugin-nextjs` (se instalará automáticamente)

## Notas Importantes

1. **API Backend**: Asegúrate de que tu API Laravel esté accesible desde Internet y tenga CORS configurado para permitir requests desde tu dominio de Netlify.

2. **Variables de Entorno**: Todas las variables que comienzan con `NEXT_PUBLIC_` son accesibles en el cliente. No uses variables sensibles sin este prefijo.

3. **Build Time**: El primer build puede tardar varios minutos. Los builds subsecuentes serán más rápidos gracias al caché de Netlify.

4. **Dominio Personalizado**: Puedes configurar un dominio personalizado en **Site settings > Domain management**.

## Solución de Problemas

### Error: "Plugin @netlify/plugin-nextjs not found"
- Netlify instalará automáticamente el plugin durante el build
- Si persiste, verifica que estés usando Node.js 20

### Error: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en el panel de Netlify
- Asegúrate de que tu API Laravel esté accesible

### Error: "API requests failing"
- Verifica que `NEXT_PUBLIC_LARAVEL_API_BASE_URL` esté configurada correctamente
- Asegúrate de que tu API tenga CORS habilitado para tu dominio de Netlify
