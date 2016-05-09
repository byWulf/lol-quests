import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/becomeGood';

describe('quests/becomeGood', function() {
    var questObject = Quests.getQuestObject('becomeGood');
    
    describe('isAvailable', function() {
        it('should be available when summoner has one champion at level 5 with grade A', function() {
            var championMasteries = [
                {championLevel: 5, highestGrade: 'A'}
            ];
            
            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner has one champion at level 3 with grade D', function() {
            var championMasteries = [
                {championLevel: 3, highestGrade: 'D'}
            ];
            
            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has no champion masteries', function() {
            var championMasteries = [];
            
            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion at level 2 with grade A', function() {
            var championMasteries = [
                {championLevel: 2, highestGrade: 'A'}
            ];
            
            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should not be available when summoner has one champion at level 5 with grade S-', function() {
            var championMasteries = [
                {championLevel: 5, highestGrade: 'S-'}
            ];
            
            chai.assert.isFalse(questObject.isAvailable({championMasteries: championMasteries}));
        });
        it('should be available when summoner has one champion at level 5 with grade A and another champion at level 2', function() {
            var championMasteries = [
                {championLevel: 5, highestGrade: 'A'},
                {championLevel: 2, highestGrade: 'A'}
            ];
            
            chai.assert.isTrue(questObject.isAvailable({championMasteries: championMasteries}));
        });
    });
    
    describe('isFinished', function() {
        it('should be running when quest started with rank A- and rank is still A-', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'A-'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with rank A- and rank is now A+', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'A-'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries[0].highestGrade = 'A+';
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with rank A- and rank whyever is now B', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'A-'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries[0].highestGrade = 'B';
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when quest started with rank A- and champion mastery whyever has now disappeared', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'A-'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be finished when quest started with rank A- and rank is now S-', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'A-'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries[0].highestGrade = 'S-';
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be finished when quest started with rank C and rank is now S+', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'C'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries[0].highestGrade = 'S+';
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be finished when quest started with rank D and rank is now C', function() {
            var championMasteries = [
                {championId: 1, championLevel: 5, highestGrade: 'D'}
            ];
            var questData = questObject.generateQuestData({championMasteries: championMasteries});
            
            championMasteries[0].highestGrade = 'C';
            
            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
    });
});