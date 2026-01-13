# 🎨 Babylon Lab

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Babylon.js](https://img.shields.io/badge/Babylon.js-000000?style=for-the-badge&logo=babylon.js&logoColor=white)](https://www.babylonjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-000000?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)

> An interactive 3D playground built with Babylon.js for learning and experimenting with 3D graphics, materials, and environments

## 📸 Project Preview

![View](https://docs.google.com/uc?id=1qiFclbBfGxjlIJ8O271GmI2gJm92dQvW)

## 🎯 Project Goal

This project was built as a **pet project for learning Babylon.js**, with the main purpose to:

- **Explore 3D graphics** using Babylon.js engine
- **Experiment with different materials** (Metal, Glass, Wood) and their properties
- **Work with environment maps** and lighting to create realistic scenes
- **Practice loading custom 3D models** (OBJ format)
- **Build an interactive UI** for real-time 3D manipulation

## 🚀 Tech Stack

### Core Technologies

- **React 19** — UI library for building the application
- **TypeScript** — typed superset of JavaScript for better code quality
- **Vite** — fast dev server and bundler
- **Tailwind CSS** — utility-first CSS framework for styling
- **SCSS** — additional styling capabilities

### 3D Graphics

- **Babylon.js 8.41** — powerful 3D engine for web
- **Babylon.js Loaders** — support for loading 3D models (OBJ format)
- **PBR Materials** — physically based rendering for realistic materials

### UI & Animations

- **Motion (Framer Motion)** — smooth animations and transitions
- **React Click Away Listener** — handling outside clicks for dropdowns

## ✨ Features

### 🎲 3D Shapes

Create and manipulate various 3D primitives:

- **Box** — cubic shapes
- **Sphere** — spherical objects
- **Cylinder** — cylindrical forms
- **Torus** — donut-shaped geometry

### 🎨 Materials

Apply different material types to your 3D objects:

- **None** — default material
- **Metal** — metallic surface with reflections
- **Glass** — transparent glass-like material
- **Wood** — wooden texture with realistic grain

### 🌍 Environments

Switch between different environment maps for varied lighting:

- **None** — minimal setup with grid floor and shadow-casting point light
- **Room** — indoor studio room with walls, ceiling, and interactive camera slider
- **Road** — outdoor road scene with natural lighting (HDR skybox)
- **Night** — nighttime environment with ambient lighting (HDR skybox)
- **Studio** — professional studio lighting setup (HDR skybox)

### 🔦 Shadows & Lighting

Real-time shadow rendering with advanced lighting:

- **Dynamic shadows** — objects cast realistic shadows on floors and walls
- **Shadow generators** — PCF (Percentage Closer Filtering) for smooth shadow edges
- **Multiple light sources** — hemispheric ambient light + point/directional lights
- **Interactive lighting** — in Room mode, light follows camera position for dynamic shadow angles

### 📦 Custom Models

- **Upload your own 3D models** in OBJ format
- Models are automatically added to the shape selector
- Full integration with the material and environment system

### 📸 Screenshots

- **Capture screenshots** of your 3D scenes
- Export your creations with a single click

### 🎛️ Interactive Controls

- **Camera position slider** — in Room mode, slide left/right to move camera and light
- **Arc rotate camera** — orbit around objects in other environments
- **Responsive design** — works on desktop, tablet, and mobile
- **Smooth animations** — polished UI transitions
- **Real-time updates** — instant visual feedback when changing settings

## 🛠 Setup and Scripts

### Prerequisites

- Node.js (recommended **v18+**)
- **pnpm** (or npm/yarn)

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Build for production

```bash
pnpm build
```

### Preview production build

```bash
pnpm preview
```

## 📁 Project Structure

```text
src/
├── components/          # Reusable React components
│   ├── BabylonCanvas/  # Main 3D scene component with Babylon.js logic
│   └── Dropdown/       # Custom dropdown component
├── root/                # Root app component (main layout and controls)
├── types/               # TypeScript type definitions
│   └── index.ts        # Shape, Material, Environment types
└── utils/               # Helper utilities
    ├── constants.ts     # Available shapes, materials, environments
    └── guards.ts        # Type guards for runtime type checking

public/
├── images/              # UI assets
└── textures/            # Environment maps (.env files)
    ├── road.env
    ├── night.env
    └── studio.env
```
