install node, then 

npm install express express-ws fs request request-promise cheerio

then 

node app.js



! a note on the includes: at runtime everything is fine but during the loading sequence of course race conditions/circular dependencies can happen, so I've put the require statement next to their use cases in the base modules and not at the top when possible.