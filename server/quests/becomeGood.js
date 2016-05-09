import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Become good
 * 
 * If a champion is at least level 3 and has not yet received a S- or better, he has to get one grade higher than his 
 * currently best grade. So for example if his currently best grade is C+, he has to get at least a B-.
 */
Quests.register('becomeGood', function() {
    var getAvailableChampions = function(summoner) {
        var availableChampions = [];
        
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championLevel >= 3 && summoner.championMasteries[i].highestGrade && Helper.gradeToNumber(summoner.championMasteries[i].highestGrade) <= Helper.gradeToNumber('A')) {
                availableChampions.push({
                    championId: summoner.championMasteries[i].championId,
                    highestGrade: summoner.championMasteries[i].highestGrade,
                    gradeNeeded: Helper.getNextGrade(summoner.championMasteries[i].highestGrade)
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
                if (Helper.gradeToNumber(summoner.championMasteries[i].highestGrade) >= Helper.gradeToNumber(questData.gradeNeeded)) {
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
            title: 'Become good with ' + champion.name + ' - get grade ' + questData.gradeNeeded,
            description: 'So far you play ' + champion.name + ' very well. Your highest grade with ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' was ' + questData.highestGrade + '. Now lets try to perform better. I wanna see at least grade ' + questData.gradeNeeded + '- at ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + '. You can improve your plays by several ways. Try focusing on your role and don\'t feed too much. Reading some guides about ' + champion.name + ' is also a good idea. With this quest you will learn focusing on the game and play ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' even better than before. Good luck!'
        };
    };
});
