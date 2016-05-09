import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/getMoreMasteries';

describe('quests/getMoreMasteries', function() {
    var questObject = Quests.getQuestObject('getMoreMasteries');
    
    describe('isAvailable', function() {
        it('should always be available', function() {
            chai.assert.isTrue(questObject.isAvailable());
        });
    });
    
    describe('isFinished', function() {
        it('should be finished when quest started with 20 CP and summoner now has 25 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5},
                {championId: 2, championLevel: 5},
                {championId: 3, championLevel: 2},
                {championId: 4, championLevel: 3},
                {championId: 5, championLevel: 5}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries.push({championId: 6, championLevel: 1});
            championMasteries.push({championId: 7, championLevel: 2});
            championMasteries.push({championId: 8, championLevel: 2});
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be finished when quest started with 20 CP and summoner now has 100 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5},
                {championId: 2, championLevel: 5},
                {championId: 3, championLevel: 2},
                {championId: 4, championLevel: 3},
                {championId: 5, championLevel: 5}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            for (var i = 6; i < 56; i++) championMasteries.push({championId: i, championLevel: 2});
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be running when quest started with 20 CP and summoner now has 24 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5},
                {championId: 2, championLevel: 5},
                {championId: 3, championLevel: 2},
                {championId: 4, championLevel: 3},
                {championId: 5, championLevel: 5}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries.push({championId: 6, championLevel: 1});
            championMasteries.push({championId: 7, championLevel: 2});
            championMasteries.push({championId: 8, championLevel: 1});
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with 20 CP and summoner now whyever has 0 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5},
                {championId: 2, championLevel: 5},
                {championId: 3, championLevel: 2},
                {championId: 4, championLevel: 3},
                {championId: 5, championLevel: 5}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            chai.assert.equal(questObject.isFinished({championMasteries: []}, questData, moment().valueOf()), Quests.RUNNING);
        });
    });
});