# ARC EKS Demo

A sample React app demonstrating a CI/CD pipeline using GitHub Actions with self-hosted runners on EKS via [Actions Runner Controller (ARC)](https://github.com/actions/actions-runner-controller).

## Project Structure

```
├── .github/workflows/ci-cd.yml   # GitHub Actions workflow
├── web/                           # React application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── App.js                 # Main React component
│   │   ├── App.css                # Styles
│   │   ├── App.test.js            # Tests
│   │   └── index.js               # Entry point
│   ├── .eslintrc.json             # ESLint config
│   └── package.json
├── scale-set-ondemand.values.yml  # ARC scale set - on-demand runners
└── scale-set-spot.values.yml      # ARC scale set - spot runners
```

## CI/CD Workflow

The workflow is **manually triggerable** (`workflow_dispatch`) and runs in three stages:

| Stage | Runner | Rationale |
|-------|--------|-----------|
| Test & Lint | `arc-runner-spot` | Cost-efficient for stateless, retriable jobs |
| Build | `arc-runner-ondemand` | Reliable capacity for the build step |
| Deploy | `arc-runner-spot` | Lightweight deployment, safe to retry |

## Local Development

```bash
cd web
npm install
npm start       # Start dev server
npm test        # Run tests
npm run lint    # Run ESLint
npm run build   # Production build
```

## Deployment

The app is deployed to GitHub Pages automatically via the workflow. Ensure GitHub Pages is enabled in the repo settings with source set to "GitHub Actions".

## GitHub ARC (Actions Runner Controller) on EKS

### Prerequisites

- EKS Cluster with EKS Auto Mode
- Authenticated with GitHub, refer to [here](https://docs.github.com/en/actions/how-tos/manage-runners/use-actions-runner-controller/authenticate-to-the-api)
- Helm, Kubectl

### Deploy ARC - Controller

```sh
NAMESPACE="arc-systems"
helm install arc \
    --namespace "${NAMESPACE}" \
    --create-namespace \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set-controller
```

### Deploy ARC - Runner Scale Set

#### Authenticate to GitHub

- Create namespace

```sh
kubectl create ns arc-runners
```

- Create secret

```sh
kubectl create secret generic pre-defined-secret \
    --namespace=arc-runners \
    --from-literal=github_app_id=123456 \
    --from-literal=github_app_installation_id=654321 \
    --from-file=github_app_private_key=private-key.pem
```

#### Deploy Scale Set

Set the right environment variable:

- On-demand - x86

```sh
INSTALLATION_NAME="arc-runner-x86-on-demand"
VALUES="scale-set-ondemand-x86.values.yml"
```

- Spot - arm64

```sh
INSTALLATION_NAME="arc-runner-arm64-spot"
VALUES="scale-set-spot-arm64.values.yml"
```

- Spot - amd64
```sh
INSTALLATION_NAME="arc-runner-x86-spot"
VALUES="scale-set-spot-x86.values.yml"
```

Deploy the chart:

```sh
helm install "${INSTALLATION_NAME}" \
    --namespace arc-runners \
    --values "${VALUES}" \
    oci://ghcr.io/actions/actions-runner-controller-charts/gha-runner-scale-set
```

Clean up the chart

```
helm uninstall "${INSTALLATION_NAME}" -n arc-runners
```