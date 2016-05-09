import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/overtakeChampion';

describe('quests/overtakeChampion', function() {
    var questObject = Quests.getQuestObject('overtakeChampion');
    
    describe('isAvailable', function() {
        it('should not be available when summoners champion mastery list is empty', function() {
            var championMasteries = [];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when only one champion (level 3 with 9000 CP) is on the mastery list', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 9000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion is level 3 with 7000 CP and another champion is level 3 with 10000 CP', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 10000},
                {championId: 1, championLevel: 3, championPoints: 7000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion is level 2 with 3000 CP and another champion is level 2 with 4000 CP', function() {
            var championMasteries = [
                {championId: 2, championLevel: 2, championPoints: 4000},
                {championId: 1, championLevel: 2, championPoints: 3000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion is level 2 with 3000 CP and another champion is level 4 with 13000 CP', function() {
            var championMasteries = [
                {championId: 2, championLevel: 4, championPoints: 13000},
                {championId: 1, championLevel: 2, championPoints: 3000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when one champion is level 2 with 4000 CP and another champion is level 3 with 6000 CP', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 6000},
                {championId: 1, championLevel: 2, championPoints: 4000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when one champion is level 3 with 6000 CP and another champion is level 3 with 8000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 8000},
                {championId: 2, championLevel: 3, championPoints: 6000}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when one champion is level 3 with 7000 CP and another champion is level 3 with 7000 CP', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 7000},
                {championId: 2, championLevel: 3, championPoints: 7000}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
    });
    
    describe('isFinished', function() {
        it('should be running when overtaking champion has less CP than the target champion', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 8000},
                {championId: 1, championLevel: 3, championPoints: 6000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[1].championLevel = 3;
            championMasteries[1].championPoints = 7500;

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when overtaking champion is a level higher but whyever still has less CP than the target champion', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 8000},
                {championId: 1, championLevel: 3, championPoints: 6000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[1].championLevel = 4;
            championMasteries[1].championPoints = 7500;

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when the overtaking champion disappeared from champion masteries list', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 8000},
                {championId: 1, championLevel: 3, championPoints: 6000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries.splice(1,1);

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be finished when overtaking champion has 1000 CP more than the target champion and target champion has same CP as at the beginning', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 8000},
                {championId: 1, championLevel: 3, championPoints: 6000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 9000},
                {championId: 2, championLevel: 3, championPoints: 8000}
            ];

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be running when both champions got the same amount of CP since the beginning and a third champion got more points than the target champion', function() {
            var championMasteries = [
                {championId: 3, championLevel: 3, championPoints: 9000},
                {championId: 2, championLevel: 3, championPoints: 8000},
                {championId: 1, championLevel: 3, championPoints: 6000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be finished when target champion got more CP since the beginning but overtaking champion still has more CP than the target champion', function() {
            var championMasteries = [
                {championId: 2, championLevel: 3, championPoints: 8000},
                {championId: 1, championLevel: 3, championPoints: 6000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries = [
                {championId: 1, championLevel: 3, championPoints: 10000},
                {championId: 2, championLevel: 3, championPoints: 9000}
            ];

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
    });
});