# ConectiON - Premium Tech E-commerce 🚀

ConectiON es una plataforma de e-commerce moderna, construida desde cero bajo un enfoque **Mobile First** y una estética de "lujo accesible" inspirada en marcas como Apple y la cultura Street Tech. 

El proyecto cuenta con una interfaz fluida (Single Page Application) y un robusto backend que gestiona un catálogo de tecnología y accesorios premium.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

---

## 🌟 Características Principales

*   **Estética Premium:** Tema oscuro minimalista con acentos en azul brillante (Variables CSS estrictas: `#CAD8F9`, `#BCD5FE`, `#000000`).
*   **Carrito de Compras Reactivo:** Gestión de estado global (Context API) con persistencia local (`localStorage`) y un *Side Drawer* animado.
*   **Catálogo Dinámico:** Integración directa con base de datos PostgreSQL mediante API REST, permitiendo filtros funcionales y vistas de detalle por producto.
*   **Integración WhatsApp:** Flujo de compra directo. Los botones de contacto y compra generan mensajes predefinidos automáticos hacia el WhatsApp oficial de la tienda.
*   **Diseño Promocional:** Banners dinámicos (Cyber Week / Ofertas de temporada) listos para incentivar conversiones.
*   **Arquitectura Limpia (Backend):** Separación modular de responsabilidad (Rutas, Controladores, Middlewares) preparada para escalar a autenticación (JWT) y paneles administrativos.

---

## 🏗️ Arquitectura del Servicio

El sistema se compone de dos repositorios/carpetas principales:

### `1. Frontend (Vite + React.js)`
*   Ubicado en la carpeta `/frontend`.
*   Desarrollado con componentes funcionales y **Vanilla CSS** (sin librerías pesadas como Tailwind o Bootstrap) para garantizar máximo control de las animaciones nativas.

### `2. Backend (Node.js + Express)`
*   Ubicado en la carpeta `/backend`.
*   Desarrollado en TypeScript, expone los endpoints de la API (`/api/products`).
*   Utiliza **Prisma ORM** para las consultas relacionales a la base de datos **PostgreSQL**.

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu entorno de desarrollo local.

### Prerrequisitos
*   [Node.js](https://nodejs.org/) (v18+)
*   [PostgreSQL](https://www.postgresql.org/) (Corriendo localmente en el puerto `5432`)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/conection-ecommerce.git
cd conection-ecommerce
```

### Paso 2: Configurar el Backend y la Base de Datos

1. Ingresa a la carpeta del backend e instala las dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Crea una base de datos en tu gestor PostgreSQL llamada `conexion_db`.
3. Verifica que el archivo `.env` en `/backend` tenga la conexión correcta a tu DB:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/conexion_db?schema=public"
   PORT=3000
   ```
4. Sincroniza el esquema de la base de datos (creará las tablas de *Product*, *Order*, etc.):
   ```bash
   npx prisma db push
   ```
5. Inyecta los productos iniciales de prueba (Seed):
   ```bash
   npx prisma db seed
   ```
6. Inicializa el servidor del backend:
   ```bash
   npm run dev
   # 🚀 Corriendo en http://localhost:3000
   ```

### Paso 3: Configurar el Frontend

1. Abre **una nueva consola apuntando al proyecto original** y entra al frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Inicializa el servidor de React (Vite):
   ```bash
   npm run dev
   # 💻 Corriendo en http://localhost:5173
   ```

¡Abre tu navegador en el puerto `5173` y disfruta de la plataforma ConectiON!

---

## 🚀 Próximas Mejoras (Roadmap)
- [ ] Módulo de Autenticación de Administrador (JWT).
- [ ] Panel Dashboard CMS para Gestión de Inventario.
- [ ] Integración de pasarelas de pago reales (Stripe / MercadoPago).
- [ ] Testing automatizado (Jest).

---
*Diseñado con el máximo detalle para ofrecer una experiencia tecnológica disruptiva. ©️ 2026 ConectiON.*
