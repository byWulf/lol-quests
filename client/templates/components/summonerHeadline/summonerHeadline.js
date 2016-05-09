import { Helper } from '../../../../shared/helper';
import { SummonerManager } from '../../../services/summonerManager';

Template.summonerHeadline.helpers({
    championMasteriesCount: function () {
        if (!SummonerManager.summoner.get()) return null;

        return Helper.getMasterySum(SummonerManager.summoner.get().championMasteries);
    },
    ddragonVersion: function () {
        if (!SummonerManager.summoner.get()) return null;

        return SummonerManager.summoner.get().ddragonVersion;
    }
});