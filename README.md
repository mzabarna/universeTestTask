# Getting started

You will need:
- [ ] Credentials for Github

## Installation

- [ ] TypeScript version not less than 5
- [ ] Node.js version not less than 18
- [ ] Playwright version not less than 1.42
- [ ] NPM version not less than 7
- [ ] Git
- [ ] Docker

# Start with repository

- [ ] Generate SSH keygen
- [ ] Add SSH public key to Github in your account settings

```
mkdir <repo_location>
cd <repo_location>
git clone <clone with SSH url>
```

## Project setup
In project root directory run
```
npm install
```
- In root directory find .env-example file
- Copy it to .env.local file and fill it with credentials

# For run tests local 

```
npx playwright test --reporter=html
```
If you need run one test, go to the spec/apiTest.spec.ts and press 

# For run tests local 

- Build Docker Image
```
docker build -t playwright-tests .
```
- Run All Tests in Container
```
docker run --rm playwright-tests
```
- Run and Access HTML Report via Browser
```
docker-compose up --build
```


