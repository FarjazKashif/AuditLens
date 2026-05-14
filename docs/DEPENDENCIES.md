# Missing Dependencies

## Root

- `concurrently`: run frontend and backend together.

## Backend

- `express`: API server.
- `mongoose`: MongoDB models and queries.
- `cors`: local frontend access.
- `dotenv`: environment configuration.
- `morgan`: request logging.
- `multer`: future file upload ingestion.
- `zod`: request validation and parser contracts.
- `nanoid`: stable short IDs for jobs and reports.
- `nodemon`: local backend development.

## Frontend

- `@vitejs/plugin-react`: Vite React support.
- `vite`: dev server/build tooling.
- `react`, `react-dom`: UI runtime.
- `tailwindcss`, `postcss`, `autoprefixer`: styling pipeline.
- `lucide-react`: icons for security operations UI.
- `axios`: API client.
- `date-fns`: compact timeline date formatting.

## Optional Later

- `bullmq` and `ioredis`: asynchronous ingestion/detection jobs once volume increases.
- `papaparse`: CSV log import.
- `monaco-editor`: advanced raw log inspection.
- `recharts`: charts after the MVP API stabilizes.
