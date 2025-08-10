## Running the Project with Docker

This project is containerized using Docker and Docker Compose for easy setup and deployment. Below are the instructions and requirements specific to this project:

### Project-Specific Docker Requirements
- **Node.js Version:** Uses Node.js `22.13.1-slim` (set via `NODE_VERSION` build argument in the Dockerfile).
- **Additional Dependencies:** The container installs build tools for C++, Python 3 (with pip), Java 17 (OpenJDK), and bash. These are required for the application's runtime or build steps.
- **Non-root User:** The application runs as a non-root user (`appuser`) for improved security.
- **Environment Variables:**
  - `NODE_ENV=production` (set in Dockerfile)
  - `NODE_OPTIONS=--max-old-space-size=4096` (set in Dockerfile)
  - `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64` (set in Dockerfile)
  - If your application requires additional environment variables, define them in a `.env` file and uncomment the `env_file` line in `docker-compose.yml`.

### Build and Run Instructions
1. **Build and Start the Application**
   ```sh
   docker compose up --build
   ```
   This will build the image using the provided Dockerfile and start the `js-app` service.

2. **Ports**
   - The main application service (`js-app`) exposes port **5001**. Access your application via `localhost:5001`.

3. **Special Configuration**
   - If you need to connect to a database, uncomment and configure the `postgres-db` service in `docker-compose.yml`.
   - To use environment variables, create a `.env` file in the project root and uncomment the `env_file` line in the compose file.

### Summary of Services
- **js-app**: Main Node.js application, runs on port 5001.
- **Database (optional)**: Example configuration for PostgreSQL is provided but commented out. Enable and configure as needed.

---
*Ensure you have Docker and Docker Compose installed on your system before proceeding.*