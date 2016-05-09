import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Get next Tier
 * 
 * For champions between tier 2 and tier 4 with 500-3000 points till the next level the summoner must get the next tier 
 * for the chosen champion. So if the summoner has a champion tier 3 with 1500 points till tier 4, he has to get this 
 * champion to at least tier 4.
 */
Quests.register('getNextTier', function() {
    var getAvailableChampions = function(summoner) {
        var champions = [];
        for (var i in summoner.championMasteries) {
            if (
                summoner.championMasteries[i].championLevel > 1 && summoner.championMasteries[i].championLevel < 5 &&
                summoner.championMasteries[i].championPointsUntilNextLevel > 500 && summoner.championMasteries[i].championPointsUntilNextLevel < 3000
            ) {
                champions.push({
                    championId: summoner.championMasteries[i].championId,
                    tierNeeded: summoner.championMasteries[i].championLevel + 1,
                    startPoints: summoner.championMasteries[i].championPoints,
                    pointsNeeded: summoner.championMasteries[i].championPoints + summoner.championMasteries[i].championPointsUntilNextLevel
                });
            }
        }
        return champions;
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
                if (summoner.championMasteries[i].championLevel >= questData.tierNeeded) {
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
            title: 'Get tier ' + questData.tierNeeded + ' with ' + champion.name,
            description: champion.name + ' is on your list of champions with room for further gains. Reach tier ' + questData.tierNeeded + ' with ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' to solve this quest. You will learn how to play ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' better and get a better understanding of ' + Helper.wordFromChampionGender(champion.id, 'his', 'her') + ' abilities.' + (questData.tierNeeded == 4 ? ' Also you will get the cool ctrl + 6 emote ingame. With that you can show the enemies your strength!' : '') + (questData.tierNeeded == 5 ? ' Also you will get the improved ctrl + 6 emote ingame. With that you can show the enemies your strength even more!' : '')
        };
    };

    this.getRemaining = function(summoner, questData) {
        var points = 0;
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                points = questData.pointsNeeded - summoner.championMasteries[i].championPoints;
                break;
            }
        }

        return numeral(points).format('0,0') + ' ' + (points == 1 ? 'champion mastery point' : 'champion mastery points');
    }
});