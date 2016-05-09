import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/haventPlayedForLong';

describe('quests/haventPlayedForLong', function() {
    var questObject = Quests.getQuestObject('haventPlayedForLong');
    
    describe('isAvailable', function() {
        it('should not be available when summoner does\'t have a champion mastery', function() {
            var championMasteries = [];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion with level 1', function() {
            var championMasteries = [
                {championLevel: 1, lastPlayTime: moment().subtract(1, 'months').valueOf()}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion with level 2', function() {
            var championMasteries = [
                {championLevel: 2, lastPlayTime: moment().subtract(1, 'months').valueOf()}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion with level 3 and he was last played 1 hour ago', function() {
            var championMasteries = [
                {championLevel: 3, lastPlayTime: moment().subtract(1, 'hours').valueOf()}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion with level 3 and he was last played 1 week ago', function() {
            var championMasteries = [
                {championLevel: 3, lastPlayTime: moment().subtract(1, 'weeks').valueOf()}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion with level 3 and he was last played 13 days and 12 hours ago', function() {
            var championMasteries = [
                {championLevel: 3, lastPlayTime: moment().subtract(324, 'hours').valueOf()}
            ];

            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner has one champion with level 3 and he was last played 14 days and 12 hours ago', function() {
            var championMasteries = [
                {championLevel: 3, lastPlayTime: moment().subtract(348, 'hours').valueOf()}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner has one champion with level 5 and he was last played 6 months ago', function() {
            var championMasteries = [
                {championLevel: 5, lastPlayTime: moment().subtract(6, 'months').valueOf()}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner has 10 champions and one of them with level 5 and he was last played 6 months ago', function() {
            var championMasteries = [
                {championLevel: 1, lastPlayTime: moment().subtract(1, 'months').valueOf()},
                {championLevel: 2, lastPlayTime: moment().subtract(2, 'years').valueOf()},
                {championLevel: 3, lastPlayTime: moment().subtract(3, 'days').valueOf()},
                {championLevel: 4, lastPlayTime: moment().subtract(4, 'minutes').valueOf()},
                {championLevel: 5, lastPlayTime: moment().subtract(6, 'months').valueOf()},
                {championLevel: 4, lastPlayTime: moment().subtract(8, 'days').valueOf()},
                {championLevel: 3, lastPlayTime: moment().subtract(9, 'minutes').valueOf()},
                {championLevel: 2, lastPlayTime: moment().subtract(10, 'hours').valueOf()},
                {championLevel: 1, lastPlayTime: moment().subtract(11, 'days').valueOf()},
                {championLevel: 2, lastPlayTime: moment().subtract(1, 'weeks').valueOf()}
            ];

            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
    });
    
    describe('isFinished', function() {
        it('should be running when quests started with level 3 champion with last played 6 months ago and he is still last played 6 months ago', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, lastPlayTime: moment().subtract(6, 'months').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(1, 'hours').valueOf()), Quests.RUNNING);
        });
        it('should be running when quests started with level 3 champion with last played 6 months ago and he suddenly disappeared from champion mastery list', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, lastPlayTime: moment().subtract(6, 'months').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: []}, questData, moment().subtract(1, 'hours').valueOf()), Quests.RUNNING);
        });
        it('should be running when quests started with level 3 champion with last played 6 months ago and he is whyever now last played 15 days ago', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, lastPlayTime: moment().subtract(6, 'months').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].lastPlayTime =  moment().subtract(15, 'days').valueOf();

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(1, 'hours').valueOf()), Quests.RUNNING);
        });
        it('should be running when quests started with level 3 champion with last played 6 months ago and he is now last played 30 minutes before quest started', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, lastPlayTime: moment().subtract(6, 'months').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].lastPlayTime =  moment().subtract(90, 'minutes').valueOf();

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(1, 'hours').valueOf()), Quests.RUNNING);
        });
        it('should be finished when quests started with level 3 champion with last played 6 months ago and he is now last played 30 minutes after the quest started', function() {
            var championMasteries = [
                {championId: 1, championLevel: 3, lastPlayTime: moment().subtract(6, 'months').valueOf()}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});

            championMasteries[0].lastPlayTime =  moment().subtract(30, 'minutes').valueOf();

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().subtract(1, 'hours').valueOf()), Quests.FINISHED);
        });
    });
});