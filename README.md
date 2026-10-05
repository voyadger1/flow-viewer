![706shots_so.png](/apps/frontend/public/img/site/706shots_so.png)

# FlowViewer

[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker&logoColor=white)](https://www.docker.com/)
[![Nextflow](https://img.shields.io/badge/nextflow-≥23.04.0-brightgreen?logo=nextflow&logoColor=white)](https://www.nextflow.io/)
[![API](https://img.shields.io/badge/API-REST-blue?logo=swagger&logoColor=white)](./api)
[![Node.js](https://img.shields.io/badge/node-≥24.0.0-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](./actions)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

FlowViewer is a tool for real-time analysis of Nextflow pipeline execution. It helps gather statistics, view process graphs, and analyze output files;
* Constructs process graphs at the start of a session and updates the data within them in real time;
* Viewing session information: who started it, when, with which command, and in which environment;
* Visualization of files created during the pipeline execution;
* Detailed analytics of process telemetry.

The main advantage of FlowViewer is its `Self-Hosted` approach. You can deploy the tool on your own laboratory server, confident that your research data will not leak to third-party servers. Since the project is open-source, you can personally verify its security or customize the solution to create your own (non-commercial) build.

## Quick Start

```shell
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/data \
  flow-viewer
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Done! 🎉

Since the application is packaged in a Docker container, it is easy to deploy on your own server (a self-hosted solution). However, it is important to launch the Docker image correctly!

When launching, you need to expose port `3000` — this is the port the application runs on.

To avoid data loss when restarting the image, you need to map the database directory from the container to the host system. The data folder inside the container is located at `/data`.

## Documentation
* [About](apps/frontend/public/docs/about.md)
* [Web View](apps/frontend/public/docs/web-view.md)
* [nf-plugin](apps/frontend/public/docs/nf-plugin.md)
* [API](apps/frontend/public/docs/api.md)

## Contact

You can contact me to collaborate on a project. I am open to job offers.

* **Author**: Alexey Kucherenko
* **Email**: antidot237@gmail.com
* **Telegram**: [rosetomorrow](https://t.me/rosetomorrow)
* **X (Twitter)**: [voyadgerodin](https://x.com/voyadgerodin)