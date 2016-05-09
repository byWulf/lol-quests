import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/playWithoutYourMain';

describe('quests/playWithoutYourMain', function() {
    var questObject = Quests.getQuestObject('playWithoutYourMain');
    
    describe('isAvailable', function() {
        it('should not be available when champion mastery list is empty', function() {
            var championMasteries = [];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when only one champion with at least 1 CP is on the mastery list', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 1}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when only one champion with 0 CP (whyever) is on the mastery list', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 0}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has two champions with both 10000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 10000},
                {championId: 2, championLevel: 3, championPoints: 10000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion has 10000 CP and another champion has 15000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 10000},
                {championId: 2, championLevel: 4, championPoints: 15000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion has 15000 CP and another champion has 10000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 4, championPoints: 15000},
                {championId: 2, championLevel: 3, championPoints: 10000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion has 20000 CP and another champion has 10000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 4, championPoints: 20000},
                {championId: 2, championLevel: 3, championPoints: 10000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when one champion has 20000 CP and another champion has 9999 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 4, championPoints: 20000},
                {championId: 2, championLevel: 3, championPoints: 9999}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when one champion has 20000 CP and ten other champions have between 100 and 9000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 4, championPoints: 20000},
                {championId: 2, championLevel: 3, championPoints: 9000},
                {championId: 3, championLevel: 2, championPoints: 4000},
                {championId: 4, championLevel: 1, championPoints: 100},
                {championId: 5, championLevel: 2, championPoints: 3500},
                {championId: 6, championLevel: 3, championPoints: 8765},
                {championId: 7, championLevel: 2, championPoints: 1955},
                {championId: 8, championLevel: 1, championPoints: 999},
                {championId: 9, championLevel: 2, championPoints: 5555},
                {championId: 10, championLevel: 3, championPoints: 8888}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion has 20000 CP, another has 15000 CP and a third one has 5000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 4, championPoints: 20000},
                {championId: 2, championLevel: 4, championPoints: 15000},
                {championId: 3, championLevel: 2, championPoints: 5000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
    });
    
    describe('isFinished', function() {
        it('should be failed when quest was started 5 hours ago and champion was last played 1 hour ago', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 1}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].lastPlayTime = moment().subtract(1, 'hours').valueOf();

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(5, 'hours').valueOf()), Quests.FAILED);
        });
        it('should be failed when quest was started 2 days ago and champion was last played 30 hours ago', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 1}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].lastPlayTime = moment().subtract(30, 'hours').valueOf();

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(2, 'days').valueOf()), Quests.FAILED);
        });
        it('should be running when quest was started 23 hours ago and champion wasn\'t played since the beginning', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 1, lastPlayTime: moment().subtract(2, 'days').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(23, 'hours').valueOf()), Quests.RUNNING);
        });
        it('should be running when quest was started 1 hour ago and champion wasn\'t played since the beginning', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 1, lastPlayTime: moment().subtract(2, 'days').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(1, 'hours').valueOf()), Quests.RUNNING);
        });
        it('should be finished when quest was started 25 hours ago and champion wasn\'t played since the beginning', function() {
            var championMasteries = [
                {championId: 1, championLevel: 1, championPoints: 1, lastPlayTime: moment().subtract(2, 'days').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(25, 'hours').valueOf()), Quests.FINISHED);
        });
    });
});