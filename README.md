# Assignment 2 — CI/CD Pipeline (Jenkins)

This repository includes a Jenkins pipeline to build, test, and (optionally) deploy the TODO application (frontend + backend).

**Files of interest**
- [Jenkinsfile](Jenkinsfile) — declarative pipeline used by Jenkins
- [backend/package.json](backend/package.json#L1-L200) — backend test scripts and jest-junit config
- [frontend/package.json](frontend/package.json#L1-L200) — frontend build script

## Quick local checks
Run these before configuring Jenkins to ensure tests and builds pass locally:

Backend:
```bash
cd backend
npm ci
npm test
```

Frontend:
```bash
cd frontend
npm ci
npm run build
```

Ensure `backend/test-results/junit.xml` is produced after `npm test`.

## Jenkins setup (summary)
1. Install Jenkins and open it at `http://localhost:8080`.
2. Manage Jenkins → Manage Plugins: install `NodeJS`, `Pipeline`, `GitHub Integration` (or `GitHub Branch Source`), and `Docker Pipeline` (if pushing images).
3. Manage Jenkins → Global Tool Configuration → `NodeJS`: add an installation named `NodeJS` (match name used in `Jenkinsfile`).
4. Add credentials:
   - GitHub PAT: `Username with password` (username = GitHub username, password = PAT). Give it a clear ID when adding.
   - Docker Hub (if used): add Docker Hub credentials and ensure the credential ID matches `DOCKERHUB_CREDENTIALS_ID` in `Jenkinsfile` (default: `docker-hub-creds`).

## Jenkinsfile notes
- The `Jenkinsfile` already includes stages: Checkout, Install (parallel frontend/backend), Test (backend), Build (frontend), Deploy (Docker build & push).
- Docker image names are now composed from the `DOCKERHUB_USERNAME` environment variable. Replace the placeholder in the `Jenkinsfile` or set the `DOCKERHUB_USERNAME` environment variable in the Jenkins job/global environment.

If you want to set the Docker username in the job, add a string parameter or configure environment injection.

## How to create the Pipeline job in Jenkins
1. New Item → Pipeline
2. Definition: `Pipeline script from SCM`
3. SCM: `Git` → Repository URL: `https://github.com/<yourusername>/<your-repo>.git`
4. Credentials: select the GitHub PAT credential you created
5. Branch: `main` (or your branch)
6. Script Path: `Jenkinsfile`
7. Save → Build Now

## Validation & deliverables
- Console output should show successful `npm install`, `npm run build`, and `npm test` stages.
- Jenkins Test Results should display test reports from `backend/test-results/junit.xml`.
- Docker image(s) (if pushed) will appear on Docker Hub at `DOCKERHUB_USERNAME/fe-todo` and `DOCKERHUB_USERNAME/be-todo`.

## Screenshots to collect
- Successful pipeline run (console + green build).
- Jenkins Test Results page.
- Docker Hub image repo page.

## Challenges & tips
- If `npm test` fails in Jenkins but passes locally, ensure Node version in Jenkins matches local Node and that `npm ci` runs without network issues.
- If Docker push fails, verify `DOCKERHUB_CREDENTIALS_ID` exists and credentials are correct.

---
Replace placeholders in `Jenkinsfile` (especially `DOCKERHUB_USERNAME`) before running a pipeline that pushes images.

If you want, I can:
- replace `your-dockerhub-username` in `Jenkinsfile` with a concrete username (if you provide it), and
- create a Jenkins job configuration snippet or sample `credentials` IDs to match your setup.
# Jenkins Pipeline for Todo App

## What I Configured

1. Added a root-level `Jenkinsfile` for a declarative pipeline.
2. Set up separate dependency installation for `frontend/` and `backend/`.
3. Added a backend Jest smoke test so Jenkins can publish test results.
4. Configured JUnit output for Jenkins test reporting.
5. Included Docker build and push steps for both services.

## Jenkins Setup Steps

1. Install Jenkins and open it at `http://localhost:8080`.
2. Install the required plugins: NodeJS, Pipeline, Git, GitHub Integration, and Docker Pipeline.
3. In Manage Jenkins > Tools, add a NodeJS installation named `NodeJS`.
4. Add GitHub credentials in Jenkins using your GitHub username and PAT.
5. Add Docker Hub credentials in Jenkins as `docker-hub-creds` if you want the deploy stage to push images.
6. Create a new Pipeline job and choose `Pipeline script from SCM`.
7. Set the SCM repository to this GitHub repo and use `Jenkinsfile` as the script path.
8. Run the job and confirm the build, test, and Docker stages complete successfully.

## Notes

1. Update `FRONTEND_IMAGE` and `BACKEND_IMAGE` in the `Jenkinsfile` with your Docker Hub username.
2. If you do not want Docker deployment, you can remove the `Deploy` stage and keep the build/test flow.
3. The backend test creates a temporary SQLite database during CI and deletes it after the run.

## Challenges

1. The repo is split into separate frontend and backend projects, so the pipeline has to run commands in each directory.
2. The backend did not have tests initially, so a small Jest test was added for Jenkins reporting.
3. JUnit output had to be configured explicitly so Jenkins can show the test report.
