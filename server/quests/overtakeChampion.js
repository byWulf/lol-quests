import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Overtake champion
 * 
 * If the summoner has 2 champions, that are at least tier 2 and less than 3000 points away from each other, he has to 
 * play the lower champion until he has more points than the target champion. If the summoner played the target champion 
 * meanwhile, he has of course play the overtaking champion even longer to overtake the target champion.
 */
Quests.register('overtakeChampion', function() {
    var getAvailableChampions = function(summoner) {
        var champions = [];
        var lastChampion = null;
        for (var i in summoner.championMasteries) {
            if (
                lastChampion && summoner.championMasteries[i].championLevel > 2 &&
                lastChampion.championPoints - summoner.championMasteries[i].championPoints < 3000
            ) {
                champions.push({
                    championId: summoner.championMasteries[i].championId,
                    overtakeChampionId: lastChampion.championId
                });
            }

            lastChampion = summoner.championMasteries[i];
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
        var pointsNeeded = 0;
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.overtakeChampionId) {
                pointsNeeded = summoner.championMasteries[i].championPoints;
                break;
            }
        }
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                if (summoner.championMasteries[i].championPoints > pointsNeeded) {
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
        var targetChampion = Helper.getChampionById(summoner.championData, questData.overtakeChampionId);

        return {
            backgroundImage: 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + champion.key + '_0.jpg',
            title: 'Overtake ' + targetChampion.name + ' with ' + champion.name,
            description: 'In the left corner... ' + champion.name + ', ' + champion.title + ' ...and in the right corner... ' + targetChampion.name + ', ' + targetChampion.title + '! It\'s a head to head fight! Who will get to the first place in ' + summoner.summonerData.name + '\'s champion mastery ladder first? Oh, wait! ' + champion.name + ' is gaining speed! Help ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' to overtake ' + targetChampion.name + '. You have to play games with ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' for gaining champion mastery points. But playing these games helps you improving your skills.'
        };
    };

    this.getRemaining = function(summoner, questData) {
        var pointsNeeded = 0;
        var pointsRemaining = 0;
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.overtakeChampionId) {
                pointsNeeded = summoner.championMasteries[i].championPoints;
                break;
            }
        }
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                pointsRemaining = pointsNeeded - summoner.championMasteries[i].championPoints;
                break;
            }
        }

        return numeral(pointsRemaining).format('0,0') + ' ' + (pointsRemaining == 1 ? 'champion mastery point' : 'champion mastery points');
    }
});