# stratz_test_twitterbot

Hi! This project is done using node.js and is meant to run serverside.

It establishes a websocket connection to a GraphQL database and executes a subscription. Different incoming cases are handled using Switch/Case statements.

You will need to add a file named config.js with the following information from your Twitter Developer account:
    module.exports = {
        consumer_key: 'insert key here',
        consumer_secret: 'insert key here',
        access_token: 'insert key here',
        access_token_secret: 'insert key here'
    }

If you do not already have a developer account from Twitter, you must request for one from Twitter.


When running the project, the file of interest is final.js. To run it locally, user "node final.js"
Dependencies: twit, graphqurl
