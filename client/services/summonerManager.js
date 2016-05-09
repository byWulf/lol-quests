/**
 * Access to the summoner data currently loaded. Methods for loading/refreshing a summoner or canceling his current quest.
 */
export const SummonerManager = new (function() {
    var inst = this;

    this.summoner = new ReactiveVar(false);
    this.chooseSummonerError = new ReactiveVar(null);

    /**
     * Generic function for updating the summoner data.
     *
     * @param region
     * @param name
     * @param cancelQuest
     * @param callback
     */
    var getSummoner = function(region, name, cancelQuest, callback) {
        Meteor.call('getSummoner', region, name, cancelQuest, function (error, result) {
            if (!error) inst.summoner.set(result);
            if (typeof callback == 'function') callback(error, result);

            console.log(result);
        });
    }

    /**
     * Loads the summoner data and stores it in the summoner variable.
     *
     * @param region
     * @param name
     * @param callback
     */
    this.loadSummoner = function(region, name, callback) {
        this.summoner.set(false);
        getSummoner(region, name, false, callback);
    };

    /**
     * Refreshes the current loaded summoner and stores the new data in the summoner variable.
     * @param callback
     */
    this.refreshSummoner = function(callback) {
        if (!this.summoner.get()) {
            callback(new Meteor.Error('No summoner loaded yet.'));
            return;
        }

        getSummoner(this.summoner.get().region, this.summoner.get().name, false, callback);
    }

    /**
     * Cancels the current quest and creates a new one. Result is stored in the summoner variable.
     * @param callback
     * @returns {boolean}
     */
    this.cancelQuest = function(callback) {
        if (!this.summoner.get()) {
            callback(new Meteor.Error('No summoner loaded yet.'));
            return;
        }

        getSummoner(this.summoner.get().region, this.summoner.get().name, true, callback);
    }
})();
