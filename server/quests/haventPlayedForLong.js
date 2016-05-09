import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Play a champion you haven't played for long
 * 
 * If the summoner has a champion at least tier 3 and hasn't played him for 2 weeks or longer, he has to play that 
 * champion again at least 1 time to finish this quest.
 */
Quests.register('haventPlayedForLong', function() {
    var getAvailableChampions = function(summoner) {
        var availableChampions = [];
        
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championLevel >= 3 && moment().subtract(2, 'weeks').diff(summoner.championMasteries[i].lastPlayTime) > 0) {
                availableChampions.push({
                    championId: summoner.championMasteries[i].championId,
                    lastPlayed: summoner.championMasteries[i].lastPlayTime
                });
            }
        }
        
        return availableChampions;
    };
    
    this.isAvailable = function(summoner) {
        return getAvailableChampions(summoner).length > 0;
    };
    
    this.generateQuestData = function(summoner) {
        var availableChampions = getAvailableChampions(summoner);

        return availableChampions[Math.floor(Math.random() * availableChampions.length)];
    };
    
    this.isFinished = function(summoner, questData, startDate) {
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                if (moment(startDate).diff(summoner.championMasteries[i].lastPlayTime) <= 0) {
                    return Quests.FINISHED;
                } else {
                    return Quests.RUNNING;
                }
            }
        }
        
        return Quests.RUNNING;
    };
    
    this.getView = function(summoner, questData) {
        var champion = Helper.getChampionById(summoner.championData, questData.championId);
        
        return {
            backgroundImage: 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + champion.key + '_0.jpg',
            title: 'Play ' + champion.name + ' again',
            description: 'So it has been ' + moment(questData.lastPlayed).fromNow(true) + ' since you last played ' + champion.name + '. Your daily quest is easy today: Just play ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' again to refresh your knowledge about the abilities and cooldowns. That way you won\'t forget how to play ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' and even can face ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' better as an opponent.'
        };
    };
});
