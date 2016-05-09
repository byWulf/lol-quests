import { chai } from 'meteor/practicalmeteor:chai';
import { Quests } from '../../../server/quests.js';
import '../../../server/quests/learnNewChampion';

describe('quests/learnNewChampion', function() {
    var questObject = Quests.getQuestObject('learnNewChampion');
    
    describe('isAvailable', function() {
        it('should not be available when no champions are given', function() {
            chai.assert.isFalse(questObject.isAvailable({championData: [], championMasteries: []}));
        });
        it('should not be available when one champion is given and this champion is on the champion masteries list', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']}
            ];
            var championMasteries = [
                {championId: 1}
            ];

            chai.assert.isFalse(questObject.isAvailable({championData: championData, championMasteries: championMasteries}));
        });
        it('should not be available when ten champions are given and these champions are on the champion masteries list', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']},
                {id: 3, name: 'Galio', tags: ['Tank', 'Mage']},
                {id: 4, name: 'Twisted Fate', tags: ['Mage']},
                {id: 5, name: 'Xin Zhao', tags: ['Fighter','Assassin']},
                {id: 6, name: 'Urgot', tags: ['Marksman','Fighter']},
                {id: 7, name: 'LeBlanc', tags: ['Assassin','Mage']},
                {id: 8, name: 'Vladimir', tags: ['Mage','Tank']},
                {id: 9, name: 'Fiddlesticks', tags: ['Mage','Support']},
                {id: 10, name: 'Kayle', tags: ['Fighter','Support']}
            ];
            var championMasteries = [
                {championId: 1},
                {championId: 2},
                {championId: 3},
                {championId: 4},
                {championId: 5},
                {championId: 6},
                {championId: 7},
                {championId: 8},
                {championId: 9},
                {championId: 10}
            ];

            chai.assert.isFalse(questObject.isAvailable({championData: championData, championMasteries: championMasteries}));
        });
        it('should be available when one champion is given and the champion masteries list is empty', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']}
            ];
            var championMasteries = [];

            chai.assert.isTrue(questObject.isAvailable({championData: championData, championMasteries: championMasteries}));
        });
        it('should be available when two champions are given and only one of them is on the champion masteries list', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']}
            ];
            var championMasteries = [
                {championId: 1}
            ];

            chai.assert.isTrue(questObject.isAvailable({championData: championData, championMasteries: championMasteries}));
        });
        it('should be available when ten champions are given and only five of them are on the champion masteries list', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']},
                {id: 3, name: 'Galio', tags: ['Tank', 'Mage']},
                {id: 4, name: 'Twisted Fate', tags: ['Mage']},
                {id: 5, name: 'Xin Zhao', tags: ['Fighter','Assassin']},
                {id: 6, name: 'Urgot', tags: ['Marksman','Fighter']},
                {id: 7, name: 'LeBlanc', tags: ['Assassin','Mage']},
                {id: 8, name: 'Vladimir', tags: ['Mage','Tank']},
                {id: 9, name: 'Fiddlesticks', tags: ['Mage','Support']},
                {id: 10, name: 'Kayle', tags: ['Fighter','Support']}
            ];
            var championMasteries = [
                {championId: 1},
                {championId: 3},
                {championId: 5},
                {championId: 7},
                {championId: 9}
            ];

            chai.assert.isTrue(questObject.isAvailable({championData: championData, championMasteries: championMasteries}));
        });
    });

    describe('isFinished', function() {
        it('should be running when the quest champion is not on the summoners champion mastery list', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']}
            ];
            var championMasteries = [
                {championId: 1, championLevel: 3}
            ];
            var questData = questObject.generateQuestData({championData: championData, championMasteries: championMasteries});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be running when the quest champion is only level 1', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']}
            ];
            var championMasteries = [
                {championId: 1, championLevel: 3}
            ];
            var questData = questObject.generateQuestData({championData: championData, championMasteries: championMasteries});

            championMasteries.push({championId: 2, championLevel: 1});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.RUNNING);
        });
        it('should be finished when the quest champion is level 2', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']}
            ];
            var championMasteries = [
                {championId: 1, championLevel: 3}
            ];
            var questData = questObject.generateQuestData({championData: championData, championMasteries: championMasteries});

            championMasteries.push({championId: 2, championLevel: 2});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
        it('should be finished when the quest champion is level 5', function() {
            var championData = [
                {id: 1, name: 'Annie', tags: ['Mage']},
                {id: 2, name: 'Olaf', tags: ['Fighter','Tank']}
            ];
            var championMasteries = [
                {championId: 1, championLevel: 3}
            ];
            var questData = questObject.generateQuestData({championData: championData, championMasteries: championMasteries});

            championMasteries.push({championId: 2, championLevel: 5});

            chai.assert.equal(questObject.isFinished({championMasteries: championMasteries}, questData, moment().valueOf()), Quests.FINISHED);
        });
    });
});