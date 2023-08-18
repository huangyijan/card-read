module.exports = {
  apps : [{
    name: 'CardReadProgramer',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3001',
    watch: '.'
  }],
 
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
