import { Quests } from '../quests.js';
import { Helper } from '../../shared/helper.js';

/**
 * Learn a new champion
 *
 * Based on the most played champion roles a random champion the summoner hasn't played yet is chosen and has to be
 * bought (if not already) and played until at least level 2.
 */
Quests.register('learnNewChampion', function() {
    var getAvailableChampionIds = function(championData, championMasteries) {
        var availableIds = [];
        
        championLoop: for (var i in championData) {
            for (var j in championMasteries) {
                if (championMasteries[j].championId == championData[i].id) continue championLoop;
            }
            availableIds.push({
                championId: championData[i].id,
                primaryTag: championData[i].tags[0]
            });
        }
        
        return availableIds;
    };
    
    this.isAvailable = function(summoner) {
        return getAvailableChampionIds(summoner.championData, summoner.championMasteries).length > 0;
    };
    
    this.generateQuestData = function(summoner) {
        var availableChampions = getAvailableChampionIds(summoner.championData, summoner.championMasteries);
        var primaryTags = Helper.getTagOrder(summoner);

        var chosenChampions = [];
        for (var i in primaryTags) {
            for (var j in availableChampions) {
                if (availableChampions[j].primaryTag == primaryTags[i].tag) chosenChampions.push(availableChampions[j]);
            }
            if (chosenChampions.length > 0) {
                var champion = chosenChampions[Math.floor(Math.random() * chosenChampions.length)];
                return {
                    championId: champion.championId,
                    chosenTag: primaryTags[i].tag
                };
            }
        }

        var champion = availableChampions[Math.floor(Math.random() * availableChampions.length)];
        return {
            championId: champion.championId
        };
    };
    
    this.isFinished = function(summoner, questData) {
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                if (summoner.championMasteries[i].championLevel >= 2) return Quests.FINISHED;
                else return Quests.RUNNING;
            }
        }
        return Quests.RUNNING;
    };
    
    this.getView = function(summoner, questData) {
        var champion = Helper.getChampionById(summoner.championData, questData.championId);
        
        return {
            backgroundImage: 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + champion.key + '_0.jpg',
            title: 'Learn a new champion - ' + champion.name,
            description: 'You know many champions already' + (questData.chosenTag ? ', especially ' + questData.chosenTag.toLowerCase() + 's' : '') + ', so what about learning a new champion? Here is your daily quest: Buy ' + champion.name + ' and play ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + ' until you reach tier 2 with ' + Helper.wordFromChampionGender(champion.id, 'him', 'her') + '. It is always good to get insight into new champions, because you learn what their abilities are and get a feeling about their cooldowns, ranges, etc.'
        };
    };

    this.getRemaining = function(summoner, questData) {
        var pointsTillRank2Needed = 1800;

        var points = pointsTillRank2Needed;
        for (var i in summoner.championMasteries) {
            if (summoner.championMasteries[i].championId == questData.championId) {
                points = pointsTillRank2Needed - summoner.championMasteries[i].championPoints;
                break;
            }
        }

        return numeral(points).format('0,0') + ' ' + (points == 1 ? 'champion mastery point' : 'champion mastery points');
    }
});
