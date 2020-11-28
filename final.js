const { query } = require('graphqurl');

var tweetContent = []

function heroIDquery(heroId){
    var heroQuery = `
            query DotaQuery{
                constants{
                hero(id:` + heroId + `){
                    displayName
                }
                }
            }
            `
    return heroQuery
}

const dotaSub =  `
subscription DotaSubscription{
  feedLive{
	  __typename
    ...on LiveEventPlayerRampageType{
      heroId,
      rampageCount,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerWinStreakType{
      winStreakCount,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroWinStreakType{
      winStreakCount,
      heroId,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroKillsType{
      killCount,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroAssistsType{
      assistCount,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroBuildingDamageType{
      buildingDamage,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroHealingType{
      healingAmount,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroHeroDamageType{
      heroDamage,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroGoldPerMinuteType{
      goldPerMinute,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroExpPerMinuteType{
      expPerMinute
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroHighImpType{
      imp,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventPlayerRankUpType{
      rank,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroDewardType{
      dewardCount,
      heroId,
      steamAccount{
        name
      }
    }
    ...on LiveEventMatchDireTide2020StompType{
        match{
          id,
          durationSeconds,
          radiantCandyScored,
          direCandyScored,
        }
    }
    ...on LiveEventPlayerDireTide2020CandyScoredType{
        heroId,
        candyScored,
        steamAccount{
            name
        }
    }
  }
}
`


function setReuslts(){
    var newResults = {
        LiveEventPlayerWinStreakType: [],
        LiveEventPlayerHeroWinStreakType: [],
        LiveEventPlayerHeroKillsType: [],
        LiveEventPlayerHeroAssistsType: [],
        LiveEventPlayerHeroGoldPerMinuteType: [],
        LiveEventPlayerHeroHighImpType: [],
        LiveEventPlayerRankUpType: [],
        LiveEventMatchDireTide2020StompType: [],
        LiveEventPlayerDireTide2020CandyScoredType: []
    }
    return newResults
}

var results = setReuslts()
console.log(Object.keys(results))
query(
  {
    query: dotaSub,
    endpoint: 'https://apibeta.stratz.com/graphql/'
  }
).then((observable) => {
  observable.subscribe(
    (event) => {
      console.log('Event received: ', JSON.stringify(event));
      if(Object.keys(results).includes(event.data.feedLive.__typename)){
          console.log("true")
          results[event.data.feedLive.__typename].push(event)
          console.log(results)
      }
      // handle event
    },
    (error) => {
      console.log('Error: ', error);
      // handle error
    }
  )
})
 .catch((error) => console.error(error));


function intervalFunc() {
    console.log('Writing to file!');
    let data = results

    const intialProcessing = new Promise(async (resolve, reject) => {
        for (var key in data){
            // Variable to contain string for tweet
            var eventDetails
            var tweetString = ""
            var queriedheroId

            // Handling cases
            switch(key){
                case "LiveEventPlayerRampageType":
                    if (data[key].length > 0){
                        console.log("Player Winstreak")
        
                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.rampageCount - a.data.feedLive.rampageCount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just got " + eventDetails.rampageCount + " rampages on " + queriedheroId
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerWinStreakType":
                    if (data[key].length > 0){
                        console.log("Player Winstreak")
        
                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.winStreakCount - a.data.feedLive.winStreakCount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        tweetString = eventDetails.steamAccount.name + " just got a " + eventDetails.winStreakCount + " winstreak!"
        
                        // Pushing to array containing tweetContent
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerHeroWinStreakType":
                    if (data[key].length > 0){
                        console.log(key)

                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.winStreakCount - a.data.feedLive.winStreakCount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just got a " + eventDetails.winStreakCount + " winstreak on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerHeroKillsType":
                    if (data[key].length > 0){
                        console.log(key)

                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.killCount - a.data.feedLive.killCount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just got " + eventDetails.killCount + " kills on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerHeroAssistsType":
                    if (data[key].length > 0){
                        console.log(key)

                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.assistCount - a.data.feedLive.assistCount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just got " + eventDetails.assistCount + " assists on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerHeroBuildingDamageType":
                    if (data[key].length > 0){
                        console.log(key)

                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.buildingDamage - a.data.feedLive.buildingDamage;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just dealt " + eventDetails.buildingDamage + " building damage on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerHeroHealingType":
                    if (data[key].length > 0){
                        console.log(key)

                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.healingAmount - a.data.feedLive.healingAmount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just healed for a total of " + eventDetails.healingAmount + " HP on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break

                case "LiveEventPlayerHeroHeroDamageType":
                    if (data[key].length > 0){
                        console.log(key)

                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.heroDamage - a.data.feedLive.heroDamage;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just dealt " + eventDetails.heroDamage + " damage on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break

                case "LiveEventPlayerHeroGoldPerMinuteType":
                    if (data[key].length > 0){
                        console.log(key)
                        if (data[key].length > 0){
                            console.log(key)
        
                            // Soring array
                            data[key].sort(function(a, b) {
                                return b.data.feedLive.goldPerMinute - a.data.feedLive.goldPerMinute;
                            });
            
                            // Extracting details to string
                            eventDetails = data[key][0].data.feedLive
                            queriedheroId = await query(
                                {
                                query: heroIDquery(eventDetails.heroId),
                                endpoint: 'https://apibeta.stratz.com/graphql/'
                                }
                            ).then((response) => {
                                return response.data.constants.hero.displayName
                            })
                            .catch((error) => console.error(error))
                            tweetString = eventDetails.steamAccount.name + " just got " + eventDetails.goldPerMinute + " GPM on " + queriedheroId + "!"
                            tweetContent.push(tweetString)
                        }
                    }
                    break
                case "LiveEventPlayerHeroExpPerMinuteType":
                    if (data[key].length > 0){
                        console.log(key)
        
                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.expPerMinute - a.data.feedLive.expPerMinute;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                                query: heroIDquery(eventDetails.heroId),
                                endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                            ).then((response) => {
                                return response.data.constants.hero.displayName
                            })
                            .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just got " + heroDamage.expPerMinute + " XPM on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerHeroHighImpType":
                    if (data[key].length > 0){
                        console.log(key)
                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.imp - a.data.feedLive.imp;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                                query: heroIDquery(eventDetails.heroId),
                                endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                            ).then((response) => {
                                return response.data.constants.hero.displayName
                            })
                            .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " had " + eventDetails.imp + " imp on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerRankUpType":
                    if (data[key].length > 0){
                        console.log(key)
                        // May need special handling
                        console.log(data[key][0])
                    }
                    break
                case "LiveEventPlayerHeroDewardType":
                    if (data[key].length > 0){
                        console.log(key)
                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.dewardCount - a.data.feedLive.dewardCount;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        queriedheroId = await query(
                            {
                                query: heroIDquery(eventDetails.heroId),
                                endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                            ).then((response) => {
                                return response.data.constants.hero.displayName
                            })
                            .catch((error) => console.error(error))
                        tweetString = eventDetails.steamAccount.name + " just dewarded " + eventDetails.dewardCount + " times on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventMatchDireTide2020StompType":
                    if (data[key].length > 0){
                        console.log("Diretide Stomp")
        
                        // Soring array
                        data[key].sort(function(a, b) {
                            return Math.abs(b.data.feedLive.match.radiantCandyScored - b.data.feedLive.match.direCandyScored) - Math.abs(a.data.feedLive.match.radiantCandyScored - a.data.feedLive.match.direCandyScored);
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
                        // tweetString = "Diretide Stomp with " 
                        //                 + Math.abs(eventDetails.match.radiantCandyScored - eventDetails.match.direCandyScored) 
                        //                 + " candy advantage! Match ID: " + eventDetails.match.id
        
                        tweetString = "Diretide Stomp with " 
                                        + Math.abs(eventDetails.match.radiantCandyScored - eventDetails.match.direCandyScored) 
                                        + " candy advantage!"
        
                        // Pushing to array containing tweetContent
                        tweetContent.push(tweetString)
                    }
                    break
                case "LiveEventPlayerDireTide2020CandyScoredType":
                    if (data[key].length > 0){
                        console.log("Diretide candy score")
        
                        // Soring array
                        data[key].sort(function(a, b) {
                            return b.data.feedLive.candyScored - a.data.feedLive.candyScored;
                        });
        
                        // Extracting details to string
                        eventDetails = data[key][0].data.feedLive
        
                        // Getting heroId
                        queriedheroId = await query(
                            {
                            query: heroIDquery(eventDetails.heroId),
                            endpoint: 'https://apibeta.stratz.com/graphql/'
                            }
                        ).then((response) => {
                            return response.data.constants.hero.displayName
                        })
                        .catch((error) => console.error(error))

                        tweetString = eventDetails.steamAccount.name + " just scored " + eventDetails.candyScored + " candy on " + queriedheroId + "!"
                        tweetContent.push(tweetString)
                    }
                    break
            }
        }
        resolve(tweetContent)
    }).then(result => {
        console.log("success")
        console.log("Logging tweetContent")

        // Splitting long tweets up
        var slicedTweet = []
        var runningTotal = 0
        var pointerTweet = 0
        console.log(tweetContent.length)
        for (var index in tweetContent){
            console.log(tweetContent[index])
            runningTotal += tweetContent[index].length
            console.log(runningTotal)
            

            if ((250-runningTotal)<0){
                slicedTweet.push(tweetContent.slice(pointerTweet, index))
                pointerTweet = index
                runningTotal = 0
            } 
        }

        // Pushing remainder
        slicedTweet.push(tweetContent.slice(pointerTweet, tweetContent.length+1))
        console.log(slicedTweet)

        // Twitter stuff
        var twit = require('twit')
        var config = require('./config.js')
        var Twitter = new twit(config);

        // Generating strings for tweets
        var slicedTweetEl = slicedTweet.length-1
        while (slicedTweetEl >= 0){
            var postContent = slicedTweet[slicedTweetEl].join('\n')
            console.log(postContent)

            
            Twitter.post('statuses/update', { status: postContent }, function(err, data, response) {
                if(err){
                    console.log(err)
                    return
                } else{
                    return
                }
            })
            slicedTweetEl -= 1
        }
        
    })


    results = setReuslts()
}

setInterval(intervalFunc, 1800000*8);
