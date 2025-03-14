# Image:
#   rylab/mongo:8-noble
# Build:
#   docker build -t rylab/mongo:8-noble .
# Run:
#   docker run -it --rm rylab/mongo:8-noble bash
# Push:
#   docker push rylab/mongo:8-noble
FROM mongo:8-noble

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    HOME=/ \
    PATH=/google-cloud-sdk/bin:$PATH

# Install required packages and Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    iftop \
    iproute2 \
    mysql-client \
    npm \
    postgresql-client \
    tcpdump && \
    npm install -g n && \
    n stable && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Helm client
RUN curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install gcloud SDK
RUN curl https://sdk.cloud.google.com | bash && \
    gcloud components install kubectl gke-gcloud-auth-plugin

VOLUME ["/.config"]
CMD ["/bin/bash"]
