import { Helper } from '../../../../shared/helper.js';
import { SummonerManager } from '../../../services/summonerManager';

Template.champion.helpers({
    champion: function(championId, key) {
        if (!SummonerManager.summoner.get()) return null;

        var champion = Helper.getChampionById(SummonerManager.summoner.get().championData, championId);
        if (champion === null) return null;
        
        return champion[key];
    },
    ddragonVersion: function() {
        if (!SummonerManager.summoner.get()) return null;

        return SummonerManager.summoner.get().ddragonVersion;
    },
    progresses: function(points) {
        var progresses = [];

        var max = Helper.getMaxMastery(SummonerManager.summoner.get().championMasteries);
        if (max == 0) return progresses;
        if (max > 100000) max = 100000;

        var ranks = [
            {points: 1800, colorClass: 'rank2'},
            {points: 4200, colorClass: 'rank3'},
            {points: 6600, colorClass: 'rank4'},
            {points: 9000, colorClass: 'rank5'}
        ]
        var rankSum = 0;
        for (var i in ranks) {
            if (points >= ranks[i].points) {
                progresses.push({
                    percent: (ranks[i].points / max) * 100,
                    colorClass: ranks[i].colorClass + ' finished'
                });
                points -= ranks[i].points;
            } else if (points > 0) {
                progresses.push({
                    percent: (points / max) * 100,
                    colorClass: ranks[i].colorClass
                });
                points = 0;
            }

            rankSum += ranks[i].points;
        }
        if (points > 100000 - rankSum) {
            progresses.push({
                percent: ((100000 - rankSum) / max) * 100,
                colorClass: 'extraRank openEnd'
            });
        } else if (points > 0) {
            progresses.push({
                percent: (points / max) * 100,
                colorClass: 'extraRank'
            });
        }

        return progresses;
    },
    points: function(points) {
        if (points >= 10000) return numeral(points).format('0 a');
        return numeral(points).format('0,0')
    }
});