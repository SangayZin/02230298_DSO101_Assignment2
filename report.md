# Assignment 2 - CI/CD Pipeline Report

## Project Overview
This assignment involved setting up a **Jenkins CI/CD Pipeline** for a Todo Application with both frontend and backend components. The pipeline automatically builds, tests, and deploys the application to Docker Hub whenever changes are pushed to the GitHub repository.

---

## Deliverables

### 1. Screenshots to Collect

#### Screenshot 1: Successful Pipeline Execution
- **What:** Screenshot of the Jenkins dashboard showing a successful pipeline run
- **Where:** Jenkins > Your Pipeline Job > Click on a completed build > You should see a **blue checkmark** or **green indicator**
- **Why:** Shows that all stages (Checkout, Install Dependencies, Test, Build, Deploy) completed without errors

#### Screenshot 2: Test Results in Jenkins
- **What:** Screenshot of Jenkins test report showing backend test results
- **Where:** Jenkins > Your Pipeline Job > Click on a successful build > Click on **"Test Result"** or **"JUnit result"** link
- **Why:** Proves that automated tests are running and passing. This shows the test metrics like number of passed/failed tests

#### Screenshot 3: Docker Hub Image Link
- **What:** Screenshot showing your Docker images on Docker Hub
- **Where:** Go to https://hub.docker.com/ > Search for your username > Look for `fe-todo` and `be-todo` repositories
- **Why:** Confirms that Docker images were successfully built and pushed to Docker Hub

### 2. GitHub Repository Link
Include the link to your GitHub repository containing this Jenkinsfile:
```
https://github.com/[your-username]/[your-repo-name]
```
**Replace with your actual GitHub username and repository name.**

---

## What I Configured - Pipeline Explanation

### **Stage 1: Checkout**
- Pulls the latest code from your GitHub repository
- Jenkins downloads all files needed to run the pipeline

### **Stage 2: Install Dependencies (Parallel Processing)**
The pipeline runs two installations at the same time to save time:
- **Frontend:** Installs all npm packages needed for the React app
- **Backend:** Installs all npm packages and rebuilds native modules if needed
- **Why parallel?** Both can install at the same time since they don't depend on each other

### **Stage 3: Test**
- Runs automated tests on the backend using Jest
- Tests check if the backend code works correctly
- Results are saved in `junit.xml` format so Jenkins can display them nicely
- **Pipeline stops here if tests fail** - it won't build or deploy broken code

### **Stage 4: Build**
- Creates a production-ready version of the frontend React application
- Runs `npm run build` which optimizes the code for the web

### **Stage 5: Deploy**
- **Builds Docker images** for both frontend and backend applications
- **Logs into Docker Hub** using stored credentials
- **Pushes images** to Docker Hub so they can be used anywhere
- **Includes retry logic:** If pushing fails, it tries again up to 3 times (with 30-second wait between attempts)
- **Final output:** Shows links to your Docker Hub repositories

---

## How the Pipeline Works (Simple Summary)

```
Code pushed to GitHub
         ↓
  Checkout code
         ↓
  Install dependencies (frontend + backend together)
         ↓
  Run tests on backend
         ↓
  Build frontend
         ↓
  Build & push Docker images
         ↓
  ✅ Pipeline complete!
```

---

## Configuration Details

### Docker Image Names
- **Frontend:** `sangay298/fe-todo:latest`
- **Backend:** `sangay298/be-todo:latest`
- (Replace `sangay298` with your Docker Hub username)

### Jenkins Credentials Used
- **GitHub PAT (Personal Access Token):** Used to access your GitHub repository
- **Docker Hub Credentials:** Used to push images to Docker Hub (ID: `docker-hub-creds`)

### Tools Required in Jenkins
The Jenkinsfile uses these plugins and tools:
- **NodeJS plugin** - to run npm commands
- **Pipeline plugin** - to run this Jenkinsfile
- **GitHub Integration** - to connect to GitHub
- **Docker Pipeline** - to build and push Docker images

---

## Challenges Faced & Solutions

### Challenge 1: Parallel Installation
**Problem:** Installing dependencies for frontend and backend one after another was slow.
**Solution:** Used parallel stages in Jenkins to install both at the same time, cutting installation time in half.

### Challenge 2: Test Results Display
**Problem:** Jenkins couldn't read test results without proper formatting.
**Solution:** Configured Jest to output results in JUnit XML format (`junit.xml`). Added `junit` publisher in Jenkins pipeline to display results.

### Challenge 3: Docker Push Failures
**Problem:** Network issues or Docker Hub temporary problems could cause pushes to fail.
**Solution:** Added retry logic that tries to push up to 3 times with 30-second delays between attempts. This handles temporary network glitches.

### Challenge 4: Credentials Management
**Problem:** Docker Hub password shouldn't be visible in pipeline logs.
**Solution:** Used Jenkins credentials management with `withCredentials()` block - the password is masked and never shown in logs.

### Challenge 5: Multiple Docker Images
**Problem:** Need to handle building and pushing multiple images (frontend + backend).
**Solution:** Used environment variables for image names, making the code cleaner and easier to update.

### Challenge 6: Different Working Directories
**Problem:** Frontend and backend are in different folders with different build commands.
**Solution:** Used `dir()` step in Jenkins to change directories before running commands in each section.

---

## Environment Variables Used

| Variable | Value | Purpose |
|----------|-------|---------|
| `DOCKERHUB_USERNAME` | sangay298 | Your Docker Hub account name |
| `FRONTEND_IMAGE` | sangay298/fe-todo:latest | Frontend Docker image name |
| `BACKEND_IMAGE` | sangay298/be-todo:latest | Backend Docker image name |
| `DOCKERHUB_CREDENTIALS_ID` | docker-hub-creds | Jenkins credential ID for Docker Hub |

---

## How to View Results

### 1. **Pipeline Success**
- Go to Jenkins Dashboard
- Click on your pipeline job
- Look for a **blue checkmark** (success) or **red X** (failure)
- Click on the build number to see detailed logs

### 2. **Test Results**
- Click on the successful build
- Look for **"Test Result"** link on the left side
- You'll see a report showing how many tests passed/failed

### 3. **Docker Images**
- Visit https://hub.docker.com/r/sangay298/fe-todo
- Visit https://hub.docker.com/r/sangay298/be-todo
- (Replace `sangay298` with your username)

---

## Key Files in This Project

- **Jenkinsfile** - The pipeline configuration that tells Jenkins what to do
- **backend/package.json** - Contains test scripts and configuration
- **frontend/package.json** - Contains build scripts
- **backend/Dockerfile** - Instructions to build the backend Docker image
- **frontend/Dockerfile** - Instructions to build the frontend Docker image

---

## Summary

This assignment successfully demonstrates:
✅ Automated CI/CD pipeline using Jenkins
✅ Parallel processing for faster builds
✅ Automated testing with result reporting
✅ Docker image creation and deployment
✅ Error handling and retry mechanisms
✅ Secure credential management

The pipeline is fully automated and production-ready!
