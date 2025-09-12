# Train schedule app

Pet project. A simple train schedule app with admin panel. 

---

## 📌 Features

- Built with Next.js (React framework)
- TypeScript support
- Modern styling (Tailwind CSS / CSS Modules)
- ESLint and Prettier for code quality

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/viktor-kindrat/train-schedule-frontend.git
cd train-schedule-frontend
````

### 2. Install dependencies

Use pnpm package manager:

```bash
pnpm install
```

### 3. Set up environment variables

Create a file named `.env.local` in the project root. Add any required variables:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
```

> Variables starting with `NEXT_PUBLIC_` are available in the browser.

### 4. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### 5. Build and run for production

```bash
pnpm run build
pnpm start
```

---

## 🧞 Scripts

| Script       | Description                          |
| ------------ | ------------------------------------ |
| `dev`        | Start development server             |
| `build`      | Create an optimized production build |
| `start`      | Start the app in production          |
| `lint`       | Run ESLint to check code style       |
| `format`     | Run Prettier to format code          |
| `type-check` | Run TypeScript type checking         |
| `test`       | Run tests (if configured)            |

---

## ✍️ Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

