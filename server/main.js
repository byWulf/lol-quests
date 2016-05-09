import { Api } from './api';

/**
 * Load static data if not existing or older than one day on server startup.
 */
Meteor.startup(function() {
    var latestVersion = Versions.findOne({},{$sort: {lastUpdate: -1}});
    if (!latestVersion || moment().diff(latestVersion.lastUpdate) > 86400000) {
        console.log('Updating static data... this could take a few minutes...');
        Api.updateStaticData();
        console.log('...finished');
    }
});

/**
 * Defining methods, which can be called from the client.
 */
Meteor.methods({
    /**
     * Manually reload static data. Pass the Riot API key used on the server for authenticating.
     *
     * @param key
     */
    updateStaticData: function(key) {
        if (key != Api.key) throw new Meteor.Error('Invalid key');

        Api.updateStaticData();
    },
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
     */
    getSummoner: function(region, name, cancelQuest) {
        return Api.getSummoner(region, name, cancelQuest);
    }
});
