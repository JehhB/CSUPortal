FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64

# Install Android SDK
ENV ANDROID_SDK_ROOT /opt/android-sdk
RUN mkdir -p ${ANDROID_SDK_ROOT} && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip commandlinetools-linux-11076708_latest.zip -d ${ANDROID_SDK_ROOT} && \
    rm commandlinetools-linux-11076708_latest.zip

# Set PATH to include Android tools
ENV PATH ${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/bin:${ANDROID_SDK_ROOT}/platform-tools

RUN npm install -g eas-cli pnpm

RUN mkdir -p ~/.android && \
    touch ~/.android/repositories.cfg && \
    yes | sdkmanager --licenses --sdk_root=${ANDROID_SDK_ROOT}

WORKDIR /app

CMD ["eas", "build", "--platform", "android", "--profile", "preview", "--non-interactive", "--local"]
