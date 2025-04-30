# **App Name**: Bar Buddy

## Core Features:

- User Info Input: Simple form for user to enter name and table number, displayed prominently on the landing page.
- Menu Display: Display the bar's menu with item names and prices, fetched from a local JSON file. Items should be easily selectable for ordering.
- Admin Access Button: A clearly visible button in the lower right corner that redirects to an admin login page.

## Style Guidelines:

- Primary color: Dark grey (#333333) for a sophisticated and modern look.
- Secondary color: Light grey (#f0f0f0) for backgrounds and subtle contrast.
- Accent: Teal (#008080) for interactive elements and highlights, providing a fresh and inviting feel.
- Clean and readable sans-serif font for all text elements.
- Use a grid-based layout for the menu to ensure items are well-organized and easy to find.
- Simple, outlined icons for menu categories and interactive elements.

## Original User Request:
Quiero desarrollar un aplicativo web para la gestión de un BAR, que tenga dos roles, usuario y administrador, el administrador podrá agregar inventario o eliminarlo y cosas así, y el usuario podrá pedir cualquier producto del bar, el usuario ingresa solo colocando su nombre y el numero de mesa, y abra un boton en la parte inferior derecha que sea para que el administrador ingrese.

el aplicativo debe tener las siguientes tecnologias: 
Frontend (Cliente - React) React.js – Biblioteca principal para construir la interfaz.

Vite – Herramienta moderna para crear proyectos React con alta velocidad.

React Router DOM – Para navegación de páginas sin recargar.

Axios – Cliente HTTP para comunicarte con el backend.

Tailwind CSS – Framework de estilos rápido y eficiente.

React Hook Form – Para formularios y validación.

Zod o Yup – Para validación de datos del lado del cliente.

Backend (Servidor - Node.js) Node.js – Motor JavaScript en el servidor.

Express.js – Framework minimalista para APIs REST.

CORS – Middleware para permitir peticiones desde React.

Helmet – Para proteger tu API de vulnerabilidades comunes.

dotenv – Para manejar variables de entorno (como contraseñas y claves).

bcrypt – Para encriptar contraseñas.

jsonwebtoken (JWT) – Para manejo de autenticación segura por token.

Base de datos Opción A - Relacional (Recomendada si manejas relaciones entre entidades):

PostgreSQL – Base de datos robusta y ampliamente usada.

Prisma ORM – Mapeo de objetos y consultas fáciles a la base de datos.

Autenticación y seguridad JWT (JSON Web Tokens) – Para login y rutas protegidas.

bcrypt – Para almacenar contraseñas de forma segura.

Express middleware personalizado – Para proteger rutas con tokens.

Herramientas y utilidades Git + GitHub – Control de versiones y colaboración.

Postman – Para probar tu API en desarrollo.

ESLint + Prettier – Para mantener código limpio y uniforme.
  