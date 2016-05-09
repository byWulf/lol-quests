import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Get more champion masteries
 *
 * The summoner has to get more champion masteries (either by playing new champions to get tier 1 or by playing already
 * played champions and getting a heigher tier). The target champion mastery sum is always a multiply of 5. The needed
 * champion mastery points to finish this quest are always between 2 and 6.
 */
Quests.register('getMoreMasteries', function() {
    this.isAvailable = function(summoner) {
        return true;
    };
    
    this.generateQuestData = function(summoner) {
        var currentMasteries = Helper.getMasterySum(summoner.championMasteries);
        var neededMasteries = Math.ceil((currentMasteries + 2) / 5) * 5;

        return {
            currentMasteries: currentMasteries,
            neededMasteries: neededMasteries
        };
    };
    
    this.isFinished = function(summoner, questData, startDate) {
        if (Helper.getMasterySum(summoner.championMasteries) >= questData.neededMasteries) return Quests.FINISHED;
        return Quests.RUNNING;
    };
    
    this.getView = function(summoner, questData) {
        return {
            backgroundClasses: 'grey',
            title: 'Get more champion masteries',
            description: 'You have an amazing amount of ' + questData.currentMasteries + ' ' + (questData.currentMasteries == 1 ? 'champion mastery' : 'champion masteries') + '. Cool! Now we\'ll try to raise them up until you reach ' + questData.neededMasteries + '. You can get masteries by playing many different champions, especially ones you haven\'t played often. That way you can get more experience but still can play the roles you want. Playing a broad range of champions extends your skills throughout the whole game. Have fun!'
        };
    };

    this.getRemaining = function(summoner, questData) {
        var masteries = questData.neededMasteries - Helper.getMasterySum(summoner.championMasteries);

        return numeral(masteries).format('0,0') + ' ' + (masteries == 1 ? 'champion mastery' : 'champion masteries');
    }
});
