import { chai } from 'meteor/practicalmeteor:chai';
import { Helper } from '../../shared/helper';

describe('Helper', function() {
    'use strict';

    describe('getMasterySum', function() {
        it('should return 0 when no champion masteries are given', function() {
            var championMasteries = [];

            chai.assert.equal(Helper.getMasterySum(championMasteries), 0);
        });
        it('should return 1 when one champion has tier 1', function() {
            var championMasteries = [
                {championLevel: 1}
            ];

            chai.assert.equal(Helper.getMasterySum(championMasteries), 1);
        });
        it('should return 3 when one champion has tier 3', function() {
            var championMasteries = [
                {championLevel: 3}
            ];

            chai.assert.equal(Helper.getMasterySum(championMasteries), 3);
        });
        it('should return 5 when one champion has tier 3 and another champion has tier 2', function() {
            var championMasteries = [
                {championLevel: 3},
                {championLevel: 2}
            ];

            chai.assert.equal(Helper.getMasterySum(championMasteries), 5);
        });
        it('should return 7 when one champion has tier 4 and another champion has tier 3', function() {
            var championMasteries = [
                {championLevel: 4},
                {championLevel: 3}
            ];

            chai.assert.equal(Helper.getMasterySum(championMasteries), 7);
        });
        it('should return 30 when six champion have tier 5', function() {
            var championMasteries = [
                {championLevel: 5},
                {championLevel: 5},
                {championLevel: 5},
                {championLevel: 5},
                {championLevel: 5},
                {championLevel: 5}
            ];

            chai.assert.equal(Helper.getMasterySum(championMasteries), 30);
        });
    });

    describe('getMaxMastery', function() {
        it('should return 0 when no champion masteries are given', function() {
            var championMasteries = [];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 0);
        });

        it ('should return 500 when one champion has 500 points', function() {
            var championMasteries = [
                {championPoints: 500}
            ];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 500);
        });

        it ('should return 123456 when one champion has 123456 points', function() {
            var championMasteries = [
                {championPoints: 123456}
            ];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 123456);
        });

        it ('should return 1000 when one champion has 1000 points and another champion has 500 points', function() {
            var championMasteries = [
                {championPoints: 1000},
                {championPoints: 500}
            ];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 1000);
        });

        it ('should return 1000 when one champion has 500 points and another champion has 1000 points', function() {
            var championMasteries = [
                {championPoints: 500},
                {championPoints: 1000}
            ];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 1000);
        });

        it ('should return 1000 when two champions have 1000 points', function() {
            var championMasteries = [
                {championPoints: 1000},
                {championPoints: 1000}
            ];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 1000);
        });

        it ('should return 1000 when ten champions are given and the fifth one has 1000 points and all others have lower points', function() {
            var championMasteries = [
                {championPoints: 500},
                {championPoints: 311},
                {championPoints: 501},
                {championPoints: 999},
                {championPoints: 1000},
                {championPoints: 5},
                {championPoints: 345},
                {championPoints: 700},
                {championPoints: 345},
                {championPoints: 150}
            ];

            chai.assert.equal(Helper.getMaxMastery(championMasteries), 1000);
        });
    });

    describe('getSecondMaxMastery', function() {
        it('should return 0 when no champion masteries are given', function() {
            var championMasteries = [];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 0);
        });

        it('should return 0 when only one champion is given', function() {
            var championMasteries = [
                {championPoints: 500}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 0);
        });

        it('should return 500 when one champion has 500 points and another champion has 1000 points', function() {
            var championMasteries = [
                {championPoints: 500},
                {championPoints: 1000}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 500);
        });

        it('should return 500 when one champion has 1000 points and another champion has 500 points', function() {
            var championMasteries = [
                {championPoints: 1000},
                {championPoints: 500}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 500);
        });

        it('should return 500 when champion one has 1000 points, champion two has 500 points and champion three has 250 points', function() {
            var championMasteries = [
                {championPoints: 1000},
                {championPoints: 500},
                {championPoints: 250}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 500);
        });

        it('should return 1000 when two champions have 1000 points and one champion has 500 points', function() {
            var championMasteries = [
                {championPoints: 1000},
                {championPoints: 1000},
                {championPoints: 500}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 1000);
        });

        it('should return 500 when two champions have 500 points and one champion has 1000 points', function() {
            var championMasteries = [
                {championPoints: 500},
                {championPoints: 500},
                {championPoints: 1000}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 500);
        });

        it('should return 900 when ten champions are given, champion three has 1000 points, champion seven has 900 points and all other champions have less than 900 points', function() {
            var championMasteries = [
                {championPoints: 500},
                {championPoints: 311},
                {championPoints: 1000},
                {championPoints: 345},
                {championPoints: 501},
                {championPoints: 5},
                {championPoints: 900},
                {championPoints: 700},
                {championPoints: 345},
                {championPoints: 150}
            ];

            chai.assert.equal(Helper.getSecondMaxMastery(championMasteries), 900);
        });
    });

    describe('getChampionById', function() {
        var championData = [
            {id: 1, name: 'Annie'},
            {id: 2, name: 'Olaf'},
            {id: 3, name: 'Galio'},
            {id: 4, name: 'Twisted Fate'},
            {id: 5, name: 'Xin Zhao'},
            {id: 6, name: 'Urgot'},
            {id: 7, name: 'LeBlanc'},
            {id: 8, name: 'Vladimir'},
            {id: 9, name: 'Fiddlesticks'},
            {id: 10, name: 'Kayle'}
        ];

        it('should return null when no champion id is given', function() {
            chai.assert.equal(Helper.getChampionById(championData, undefined), null);
        });

        it('should return null when invalid champion id is given', function() {
            chai.assert.equal(Helper.getChampionById(championData, 'foobar'), null);
        });

        it('should return null when not existing champion id is given', function() {
            chai.assert.equal(Helper.getChampionById(championData, 5000), null);
        });

        it('should return Annie when champion id 1 is given', function() {
            var champion = Helper.getChampionById(championData, 1);
            chai.assert.equal(champion.name, 'Annie');
        });

        it('should return Fiddlesticks when champion id 9 is given', function() {
            var champion = Helper.getChampionById(championData, 9);
            chai.assert.equal(champion.name, 'Fiddlesticks');
        });
    });

    describe('getNextGrade', function() {
        it('should return null when no grade is given', function() {
            chai.assert.equal(Helper.getNextGrade(undefined), null);
        });
        it('should return null when invalid grade is given', function() {
            chai.assert.equal(Helper.getNextGrade('Z'), null);
        });
        it('should return null when S is given', function() {
            chai.assert.equal(Helper.getNextGrade('S'), null);
        });
        it('should return null when S- is given', function() {
            chai.assert.equal(Helper.getNextGrade('S-'), null);
        });
        it('should return B when C is given', function() {
            chai.assert.equal(Helper.getNextGrade('C'), 'B');
        });
        it('should return A when B+ is given', function() {
            chai.assert.equal(Helper.getNextGrade('B+'), 'A');
        });
        it('should return S when A- is given', function() {
            chai.assert.equal(Helper.getNextGrade('A-'), 'S');
        });
    });

    describe('gradeToNumber', function() {
        it('should return null when no grade is given', function() {
            chai.assert.equal(Helper.gradeToNumber(undefined), null);
        });
        it('should return null when invalid grade is given', function() {
            chai.assert.equal(Helper.gradeToNumber('Z'), null);
        });
        it('should return 5 when S is given', function() {
            chai.assert.equal(Helper.gradeToNumber('S'), 5);
        });
        it('should return 5 when S- is given', function() {
            chai.assert.equal(Helper.gradeToNumber('S-'), 5);
        });
        it('should return 2 when C is given', function() {
            chai.assert.equal(Helper.gradeToNumber('C'), 2);
        });
        it('should return 3 when B+ is given', function() {
            chai.assert.equal(Helper.gradeToNumber('B+'), 3);
        });
        it('should return 4 when A- is given', function() {
            chai.assert.equal(Helper.gradeToNumber('A-'), 4);
        });
    });

    describe('getTagOrder', function() {
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

        it('should return empty array when no champion masteries are given', function() {
            var summoner = {
                championMasteries: [],
                championData: championData
            };

            chai.assert.deepEqual(Helper.getTagOrder(summoner), []);
        });

        it('should return empty array when only invalid champions in champion masteries are given', function() {
            var summoner = {
                championMasteries: [
                    {championId: 'Foobar', championPoints: 1000},
                    {championId: null, championPoints: 1000},
                    {championId: 5000, championPoints: 1000}
                ],
                championData: championData
            };

            chai.assert.deepEqual(Helper.getTagOrder(summoner), []);
        });

        it('should return Fighter->Assassin when only Xin Zhao has champion Masteries', function() {
            var summoner = {
                championMasteries: [
                    {championId: 5, championPoints: 1000}
                ],
                championData: championData
            };

            var tagOrder = Helper.getTagOrder(summoner);

            chai.assert.equal(tagOrder[0].tag, 'Fighter');
            chai.assert.equal(tagOrder[1].tag, 'Assassin');
            chai.assert.isUndefined(tagOrder[2]);
        });

        it('should return Mage->Assassin when Twisted Fate has 1000 champion mastery points and LeBlanc has 2000 champion mastery points', function() {
            var summoner = {
                championMasteries: [
                    {championId: 4, championPoints: 1000},
                    {championId: 7, championPoints: 2000}
                ],
                championData: championData
            };

            var tagOrder = Helper.getTagOrder(summoner);

            chai.assert.equal(tagOrder[0].tag, 'Mage');
            chai.assert.equal(tagOrder[1].tag, 'Assassin');
            chai.assert.isUndefined(tagOrder[2]);
        });

        it('should return Support->Fighter->Mage when Fiddlesticks has 1000 CP and Kayle as 1001 CP', function() {
            var summoner = {
                championMasteries: [
                    {championId: 9, championPoints: 1000},
                    {championId: 10, championPoints: 1001}
                ],
                championData: championData
            };

            var tagOrder = Helper.getTagOrder(summoner);

            chai.assert.equal(tagOrder[0].tag, 'Support');
            chai.assert.equal(tagOrder[1].tag, 'Fighter');
            chai.assert.equal(tagOrder[2].tag, 'Mage');
            chai.assert.isUndefined(tagOrder[3]);
        });

        it('should return Fighter->Mage->Support->Assassin when LeBlanc has 1000 CP, Xin Zhao has 2000 CP, Fiddlesticks has 3000 CP and Kayle has 4000 CP', function() {
            var summoner = {
                championMasteries: [
                    {championId: 7, championPoints: 1000},
                    {championId: 5, championPoints: 2000},
                    {championId: 9, championPoints: 3000},
                    {championId: 10, championPoints: 4000}
                ],
                championData: championData
            };

            var tagOrder = Helper.getTagOrder(summoner);

            chai.assert.equal(tagOrder[0].tag, 'Fighter');
            chai.assert.equal(tagOrder[1].tag, 'Support');
            chai.assert.equal(tagOrder[2].tag, 'Mage');
            chai.assert.equal(tagOrder[3].tag, 'Assassin');
            chai.assert.isUndefined(tagOrder[4]);
        });
    });

    describe('wordFromChampionGender', function() {
        it('should return empty string when no parameter is given', function() {
            chai.assert.equal(Helper.wordFromChampionGender(), '');
        });

        it('should return male/female when no champion id is given', function() {
            chai.assert.equal(Helper.wordFromChampionGender(undefined, 'male', 'female'), 'male/female');
        });

        it('should return male/female when non existing champion id is given', function() {
            chai.assert.equal(Helper.wordFromChampionGender(5000, 'male', 'female'), 'male/female');
        });

        it('should return male when Twisted Fate is given', function() {
            chai.assert.equal(Helper.wordFromChampionGender(4, 'male', 'female'), 'male');
        });

        it('should return female when Annie is given', function() {
            chai.assert.equal(Helper.wordFromChampionGender(1, 'male', 'female'), 'female');
        });
    });
});