/**
 * Quest manager for handling quests for the summoners.
 */
export const Quests = new (function() {
    this.FINISHED = 'finished';
    this.RUNNING = 'running';
    this.FAILED = 'failed';

    var quests = {};

    /**
     * Register a quest object. It has to implement the following interface:
     * quest.isAvailable(summoner); //Return if this quest is available for the given summoner
     * quest.isFinished(summoner, questData, startDate); //Return this.FINISHED/this.RUNNING/this.FAILED status about the given quest for the given summoner
     * quest.getView(summoner, questData); //Return an object with the following attributes: title, description, backgroundImage (optional), backgroundClasses (optional)
     * quests.getRemaining(summoner, questData); //(optional) Return a string representing the remaining amount needed to finish this quest. The remaining time is displayed automatically.
     *
     * @param name
     * @param quest
     */
    this.register = function(name, quest) {
        quests[name] = new quest();
    };

    /**
     * Creates a new quest for the given summoner. If summoner.lastQuest is set, it will try to find another quest so
     * quests don't repeat. It will return null if no quest is available for the summoner.
     *
     * @param summoner
     * @returns Object|null
     */
    this.getQuest = function(summoner) {
        //Find all available quests
        var questTypes = [];
        for (var i in quests) {
            if (quests[i].isAvailable(summoner)) questTypes.push(i);
        }
        if (questTypes.length == 0) return null;

        //Don't repeat a quest if there are other quests available
        if (questTypes.length > 1 && summoner.lastQuest) {
            for (var i in questTypes) {
                if (questTypes[i] == summoner.lastQuest.questType) {
                    questTypes.splice(i, 1);
                    break;
                }
            }
        }

        var questType = questTypes[Math.floor(Math.random() * questTypes.length)];
        var data = quests[questType].generateQuestData(summoner);

        return {
            questType: questType,
            startDate: moment().valueOf(),
            data: data,
            view: quests[questType].getView(summoner, data)
        };
    };

    /**
     * Returns the quest object for the given quest type.
     *
     * @param questType
     * @returns {*}
     */
    this.getQuestObject = function(questType) {
        return quests[questType];
    };

    /**
     * Returns what the status for current quest for the given summoner is.
     *
     * @param summoner
     *
     * @returns this.RUNNING|this.FINISHED|this.FAILED
     */
    this.isFinished = function(summoner) {
        if (!summoner.currentQuest) return this.FAILED;

        if (typeof quests[summoner.currentQuest.questType] == 'undefined') throw new Meteor.Error(500, 'Unkown quest type.');

        var state = quests[summoner.currentQuest.questType].isFinished(summoner, summoner.currentQuest.data, summoner.currentQuest.startDate);
        if (state != this.FINISHED && moment().diff(summoner.currentQuest.startDate) > 86400000) state = this.FAILED;

        return state;
    };

    /**
     * Returns the remaining amount string representing the quest status for the current quest for the given summoner.
     *
     * @param summoner
     * @returns {*}
     */
    this.getRemaining = function(summoner) {
        if (typeof quests[summoner.currentQuest.questType] == 'undefined') throw new Meteor.Error(500, 'Unkown quest type.');
        
        return typeof quests[summoner.currentQuest.questType].getRemaining == 'function' ? quests[summoner.currentQuest.questType].getRemaining(summoner, summoner.currentQuest.data) : null;
    }
})();