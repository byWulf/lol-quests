import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/getNextTier';

describe('quests/getNextTier', function() {
    var questObject = Quests.getQuestObject('getNextTier');

    describe('isAvailable', function() {
        it('should not be available when summoner does\'t have a champion mastery', function() {
            var championMasteries = [];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner does only have a level 1 champion with 1500 points till next level', function() {
            var championMasteries = [
                {championLevel: 1, championPoints: 0, championPointsUntilNextLevel: 1500}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner does only have a level 5 champion with (whyever) 2000 points till next level', function() {
            var championMasteries = [
                {championLevel: 5, championPoints: 50000, championPointsUntilNextLevel: 2000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner does only have a level 3 champion with 500 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 12100, championPointsUntilNextLevel: 500}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner does only have a level 3 champion with 3000 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 9600, championPointsUntilNextLevel: 3000}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner does have a level 2 champion with 2000 points till next level', function() {
            var championMasteries = [
                {championLevel: 2, championPoints: 4000, championPointsUntilNextLevel: 2000}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner does have a level 4 champion with 2000 points till next level', function() {
            var championMasteries = [
                {championLevel: 4, championPoints: 19600, championPointsUntilNextLevel: 2000}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner does have a level 3 champion with 501 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 12099, championPointsUntilNextLevel: 501}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner does have a level 3 champion with 2999 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 9601, championPointsUntilNextLevel: 2999}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner does have 10 champions and one of them is level 3 with 2000 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 12100, championPointsUntilNextLevel: 500},
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000},
                {championLevel: 1, championPoints: 500, championPointsUntilNextLevel: 1000},
                {championLevel: 2, championPoints: 1800, championPointsUntilNextLevel: 4200},
                {championLevel: 3, championPoints: 6000, championPointsUntilNextLevel: 6600},
                {championLevel: 4, championPoints: 12600, championPointsUntilNextLevel: 9000},
                {championLevel: 5, championPoints: 50000, championPointsUntilNextLevel: 0},
                {championLevel: 4, championPoints: 13000, championPointsUntilNextLevel: 8600},
                {championLevel: 3, championPoints: 9000, championPointsUntilNextLevel: 3600},
                {championLevel: 2, championPoints: 2800, championPointsUntilNextLevel: 3200}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
    });
    
    describe('isFinished', function() {
        it('should be running when quest started with level 3 champion with 2000 points till next level and he still is level 3 with 2000 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with level 3 champion with 2000 points till next level and he still is level 3 with 0 points till next level', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].championPoints = 12600;
            championMasteries[0].championPointsUntilNextLevel = 0;

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with level 3 champion with 2000 points till next level and he suddenly is level 2l', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].championLevel = 2;

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with level 3 champion with 2000 points till next level and he disappeared from the champion mastery list', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: []}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be finished when quest started with level 3 champion with 2000 points till next level and he now is level 4', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].championLevel = 4;
            championMasteries[0].championPoints = 12600;
            championMasteries[0].championPointsUntilNextLevel = 0;

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be finished when quest started with level 3 champion with 2000 points till next level and he now is level 5', function() {
            var championMasteries = [
                {championLevel: 3, championPoints: 10600, championPointsUntilNextLevel: 2000}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries[0].championLevel = 5;
            championMasteries[0].championPoints = 23000;
            championMasteries[0].championPointsUntilNextLevel = 0;

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
    });
});