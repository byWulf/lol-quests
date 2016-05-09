import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Play without your Main for one day
 *
 * If the summoner has a main champion (more than double the points to the second most played champion), he has to play
 * LoL for one day without playing his main.
 */
Quests.register('playWithoutYourMain', function() {
    this.isAvailable = function(summoner) {
        var maxMastery = Helper.getMaxMastery(summoner.championMasteries);
        var secondMaxMastery = Helper.getSecondMaxMastery(summoner.championMasteries);
        
        if (maxMastery == 0) return false;
        
        return secondMaxMastery / maxMastery < 0.5;
    };
    
    this.generateQuestData = function(summoner) {
        var maxPoints = Helper.getMaxMastery(summoner.championMasteries);
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championPoints == maxPoints) {
                return {
                    championId: summoner.championMasteries[i].championId
                };
            }
        }
    };
    
    this.isFinished = function(summoner, questData, startDate) {
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                var dayOver = moment().diff(startDate) > 86400000;
                var wasPlayed = moment(startDate).diff(summoner.championMasteries[i].lastPlayTime) < 0;

                if (dayOver && !wasPlayed) return Quests.FINISHED;
                else if (wasPlayed) return Quests.FAILED;
                else return Quests.RUNNING;
            }
        }
        
        return Quests.RUNNING;
    };
    
    this.getView = function(summoner, questData) {
        var champion = Helper.getChampionById(summoner.championData, questData.championId);
        
        return {
            backgroundImage: 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + champion.key + '_0.jpg',
            backgroundClasses: 'grayscale',
            title: 'Play without your main for 1 day',
            description: 'You\'re amazingly good with ' + champion.name + '. You play ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' more often than every other champion. Good! As your daily quest, take a break from your main and try other champions. It\'s good to try out other champions as well, so you can collect more experience throughout the game. You will only get better when you face challenges that are not that easy to solve. But I know you\'ll get that!'
        };
    };
});
