import LolApiBundle from 'leagueapi';
import { Quests } from './quests.js';

/**
 * Class for interacting with the Riot API.
 */
export const Api = new (function() {
    this.key = process.env.LOLQUESTS_APIKEY;
    if (!this.key) {
        console.error('You haven\'t saved your Riot API Key into the environment variable LOLQUESTS_APIKEY. Please do so with "export LOLQUEST_APIKEY=your key goes here" before starting the app.');
        process.exit(1);
    }
    
    LolApiBundle.init(process.env.LOLQUESTS_APIKEY, 'euw');
    
    var LolApi = {
        Summoner: Async.wrap(LolApiBundle.Summoner, ['getByName']),
        Static: Async.wrap(LolApiBundle.Static, ['getChampionList', 'getVersions']),
        ChampionMastery: Async.wrap(LolApiBundle.ChampionMastery, ['getChampions'])
    };

    /**
     * Loads the needed static data (championList and ddragonVersion) for all regions and stores them in the database.
     */
    this.updateStaticData = function() {
        for (var region in Regions) {
            var championData = LolApi.Static.getChampionList({dataById: true, locale: 'en_US', champData: 'tags'}, region).data;
    
            for (var i in championData) {
                championData[i].region = region;
                Champions.update({id: championData[i].id, region: region}, {$set: championData[i]}, {upsert: true});
            }
    
            var ddragonVersion = LolApi.Static.getVersions(region)[0];
            Versions.update({region: region}, {$set: {region: region, version: ddragonVersion, lastUpdate: moment().valueOf()}}, {upsert: true})
        }
    };

    /**
     * Loads the needed summoner data from the Riot API and returns it with additional information needed for further
     * computation.
     *
     * @param region
     * @param name
     * @returns Object
     *
     * @throws Meteor.Error
     */
    var loadSummoner = function(region, name) {
        try {
            var summonerResult = LolApi.Summoner.getByName(name, region);
            var summonerData = summonerResult[Object.keys(summonerResult)[0]];
        } catch (e) {
            throw new Meteor.Error(404, 'Summoner not found');
        }

        try {
            var championMasteries = LolApi.ChampionMastery.getChampions(summonerData.id, region);
        } catch (e) {
            throw new Meteor.Error(404, 'Champion masteries couldn\'t be loaded.');
        }

        var championData = Champions.find({
            region: region
        }).fetch();
        var ddragonVersion = Versions.findOne({region: region}).version;

        return {
            region: region.toLowerCase(),
            name: name.toLowerCase(),
            lastUpdate: moment().valueOf(),
            summonerData: summonerData,
            championData: championData,
            championMasteries: championMasteries,
            ddragonVersion: ddragonVersion
        };
    };

    /**
     * Loads the summoner data for the given region and summoner name and returns it. Also checks if the current quest
     * is finished or failed and creates a new quest.
     *
     * If summoner data is not existing or older than 5 minutes, it is updated from the API.
     * If cancelQuest is passed, the current quest (if any) is canceld and a new one is created.
     *
     * @param region
     * @param name
     * @param cancelQuest
     * @returns {any}
     */
    this.getSummoner = function(region, name, cancelQuest) {
        var summoner = Summoners.findOne({region: region.toLowerCase(), name: name.toLowerCase()});

        //Reloading summoner data if not existing or older than 5 minutes
        if (!summoner || summoner.lastUpdate < moment().subtract(5, 'minutes').valueOf()) {
            var loadedSummoner = loadSummoner(region, name);
            loadedSummoner.currentQuest = summoner ? summoner.currentQuest : null;
            loadedSummoner.lastQuest = summoner ? summoner.lastQuest : null;

            summoner = loadedSummoner;
        }

        //Check if current quest is finished or failed and start a new quest
        if (summoner.currentQuest) {
            summoner.currentQuest.effect = null;
            summoner.currentQuest.state = Quests.isFinished(summoner);
            if (cancelQuest) {
                summoner.currentQuest.state = Quests.FAILED;
            }
    
            if (summoner.currentQuest.state != Quests.RUNNING) {
                summoner.lastQuest = summoner.currentQuest;
                summoner.lastQuest.effect = 'slideInRight';
                summoner.currentQuest = Quests.getQuest(summoner);
                if (summoner.currentQuest) {
                    summoner.currentQuest.effect = 'tada';
                }
            } else {
                if (summoner.lastQuest) {
                    summoner.lastQuest.effect = null;
                }
            }
        } else {
            summoner.currentQuest = Quests.getQuest(summoner);
            if (summoner.currentQuest) {
                summoner.currentQuest.effect = 'tada';
            }
        }

        //Loading additional quest data
        if (summoner.currentQuest) {
            summoner.currentQuest.state = Quests.RUNNING;
            summoner.currentQuest.remaining = Quests.getRemaining(summoner, summoner.currentQuest);
        }

        //Save new summoner data in database
        if (typeof summoner._id != 'undefined') delete summoner._id;
        Summoners.update({region: region.toLowerCase(), name: name.toLowerCase()}, {$set: summoner}, {upsert: true});
    
        return summoner;
    }
})();

