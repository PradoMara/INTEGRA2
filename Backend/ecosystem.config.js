module.exports = {
  apps: [{
    name: "marketuct-api",
    script: "server.js",
    env: {
      NODE_ENV: "production",
      PORT: "3000"
    }
  }]
}
