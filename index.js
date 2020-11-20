const { query } = require('graphqurl');
var fs = require('fs');

const heroIDquery = `
query DotaQuery{
    constants{
      hero(id:56){
        displayName
      }
    }
  }
`


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

const gql2 = `
subscription DotaSubscription{
  feedLive{
	  __typename
    ...on LiveEventPlayerWinStreakType{
      winStreakCount,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroWinStreakType{
      heroId,
      winStreakCount,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroKillsType{
      killCount,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroAssistsType{
      assistCount,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroGoldPerMinuteType{
      goldPerMinute,
    	steamAccount{
        name
      }
    }
    ...on LiveEventPlayerHeroHighImpType{
      imp,
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
    fs.writeFileSync('data.json', JSON.stringify(results))
    results = setReuslts()
}

setInterval(intervalFunc, 1800000*4);