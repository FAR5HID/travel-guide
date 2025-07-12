# Travel Guide

A web application to help users discover and plan travel experiences.

## Features

- Find optimized travel routes based on time, budget, and preferences
- Hybrid route-finding algorithm (BFS + DFS + greedy heuristic)
- View suggested travel routes directly on Google Maps
- Search and explore destinations and attractions
- View detailed information, images, and ratings for places
- Weather forecast and crowd prediction for selected dates
- Find and connect with travel partners
- Responsive, interactive user interface
- Admin panel for managing locations and routes

## Getting Started

### Prerequisites

- Node.js v16+
- npm

### Installation

```bash
git clone https://github.com/FAR5HID/travel-guide.git
cd travel-guide/frontend
npm i
cd ..
docker-compose build
```

### Running the App

```bash
cd travel-guide
docker-compose up
```

The app will be available at `http://localhost:3000`.
