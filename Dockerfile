# Image: rylab/mongo:7-jammy
# Build it:
#  docker build -t rylab/mongo:7-jammy .
# Push it:
#  docker push rylab/mongo:7-jammy
# Running it:
#  docker run -it --rm rylab/mongo:7-jammy bash
FROM mongo:7-jammy

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Install NodeJS and npm
RUN apt-get update && apt-get install -y curl iftop iproute2 mysql-client postgresql-client npm tcpdump && apt-get clean
RUN npm install -g n
RUN n stable

# Install Helm client
RUN curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

ENV HOME /
RUN curl https://sdk.cloud.google.com | bash

ENV PATH /google-cloud-sdk/bin:$PATH
VOLUME ["/.config"]
CMD ["/bin/bash"]

RUN gcloud components install kubectl gke-gcloud-auth-plugin
