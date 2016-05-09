/**
 * Helper class with useful methods used by server and client.
 */
export const Helper = new (function() {
    /**
     * Returns the total amount of champion masteries for the given summoner.
     *
     * @param championMasteries
     * @returns {number}
     */
    this.getMasterySum = function(championMasteries) {
        var sum = 0;
        for (var i in championMasteries) {
            sum += championMasteries[i].championLevel;
        }
        return sum;
    }

    /**
     * Returns the highest champion mastery points from the given champion masteries list.
     *
     * @param championMasteries
     * @returns {number}
     */
    this.getMaxMastery = function(championMasteries) {
        var max = 0;
        for (var i in championMasteries) {
            max = Math.max(max, championMasteries[i].championPoints);
        }
        return max;
    }

    /**
     * Returns the second highest champion mastery points from the given champion masteries list. If the first two
     * places have the same amount, the highest amount is returned anyway.
     *
     * @param championMasteries
     * @returns {number}
     */
    this.getSecondMaxMastery = function(championMasteries) {
        var max = this.getMaxMastery(championMasteries);
        
        var maxFound = false;
        var secondMax = 0;
        for (var i in championMasteries) {
            if (championMasteries[i].championPoints == max && !maxFound) {
                maxFound = true;
                continue;
            }
            if (championMasteries[i].championPoints > secondMax) {
                secondMax = championMasteries[i].championPoints;
            }
        }
        
        return secondMax;
    }

    /**
     * Returns the championData from the champion with the given championId.
     *
     * @param championData
     * @param id
     * @returns {*}
     */
    this.getChampionById = function(championData, id) {
        for (var i in championData) {
            if (championData[i].id == id) return championData[i];
        }
        
        return null;
    }

    /**
     * Returns the next higher grade for the given grade. The given grade can have a '+' or '-'.
     *
     * @param grade
     * @returns {*}
     */
    this.getNextGrade = function(grade) {
        if (typeof grade != 'string' || grade.length < 1) return null;

        var nextGrade = null;
        
        switch (grade[0]) {
            case 'A': nextGrade = 'S'; break;
            case 'B': nextGrade = 'A'; break;
            case 'C': nextGrade = 'B'; break;
            case 'D': nextGrade = 'C'; break;
        }

        return nextGrade;
    }

    /**
     * Returns a number corresponding to the given grade (ignores '+' and '-'). This number can be used to compare
     * grades (higher number = higher grade).
     *
     * @param grade
     * @returns {*}
     */
    this.gradeToNumber = function(grade) {
        if (typeof grade != 'string' || grade.length < 1) return null;

        var number = null;
        
        switch (grade[0]) {
            case 'S': number = 5; break;
            case 'A': number = 4; break;
            case 'B': number = 3; break;
            case 'C': number = 2; break;
            case 'D': number = 1; break;
        }

        return number;
    }

    /**
     * Returns an array of objects with the tags the given summoner plays sorted by the most played tags descending. The
     * first tag is worth 50% of the champion mastery points. The second tag (if existing) is worth 33% of the champion
     * mastery points.
     *
     * @param summoner
     * @returns {Array}
     */
    this.getTagOrder = function(summoner) {
        var tags = {};
        for (var i in summoner.championMasteries) {
            for (var j in summoner.championData) {
                if (summoner.championData[j].id != summoner.championMasteries[i].championId) continue;
                
                for (var k = 0; k < summoner.championData[j].tags.length; k++) {
                    if (typeof tags[summoner.championData[j].tags[k]] == 'undefined') tags[summoner.championData[j].tags[k]] = 0;
                    tags[summoner.championData[j].tags[k]] += summoner.championMasteries[i].championPoints / (k + 2);
                }
            }
        }
        var orderedTags = [];
        for (var i in tags) {
            orderedTags.push({tag: i, points: tags[i]});
        }
        orderedTags.sort(function(a, b) {
            return a.points > b.points ? -1 : 1;
        });
        return orderedTags;
    }

    /**
     * Genderfies a word according to the given championId. Returns the given maleWord if given championId is male.
     * Returns the given femaleWord if given championId is female. Returns both (male/female) if given championId is
     * unknown or gender is unknown.
     *
     * @param championId
     * @param maleWord
     * @param femaleWord
     * @returns {string}
     */
    this.wordFromChampionGender = function(championId, maleWord, femaleWord) {
        if (!championId && !maleWord && !femaleWord) return '';
        
        switch (championId) {
            case 1: return femaleWord; //Annie
            case 2: return maleWord; //Olaf
            case 3: return maleWord; //Galio
            case 4: return maleWord; //Twisted Fate
            case 5: return maleWord; //Xin Zhao
            case 6: return maleWord; //Urgot
            case 7: return femaleWord; //LeBlanc
            case 8: return maleWord; //Vladimir
            case 9: return maleWord; //Fiddlesticks
            case 10: return femaleWord; //Kayle
            case 11: return maleWord; //Master Yi
            case 12: return maleWord; //Alistar
            case 13: return maleWord; //Ryze
            case 14: return maleWord; //Sion
            case 15: return femaleWord; //Sivir
            case 16: return femaleWord; //Soraka
            case 17: return maleWord; //Teemo
            case 18: return femaleWord; //Tristana
            case 19: return maleWord; //Warwick
            case 20: return maleWord; //Nunu
            case 21: return femaleWord; //Miss Fortune
            case 22: return femaleWord; //Ashe
            case 23: return maleWord; //Tryndamere
            case 24: return maleWord; //Jax
            case 25: return femaleWord; //Morgana
            case 26: return maleWord; //Zilean
            case 27: return maleWord; //Singed
            case 28: return femaleWord; //Evelynn
            case 29: return maleWord; //Twitch
            case 30: return maleWord; //Karthus
            case 31: return maleWord; //Cho'Gath
            case 32: return maleWord; //Amumu
            case 33: return maleWord; //Rammus
            case 34: return femaleWord; //Anivia
            case 35: return maleWord; //Shaco
            case 36: return maleWord; //Dr. Mundo
            case 37: return femaleWord; //Sona
            case 38: return maleWord; //Kassadin
            case 39: return femaleWord; //Irelia
            case 40: return femaleWord; //Janna
            case 41: return maleWord; //Gangplank
            case 42: return maleWord; //Corki
            case 43: return femaleWord; //Karma
            case 44: return maleWord; //Taric
            case 45: return maleWord; //Veigar
            case 48: return maleWord; //Trundle
            case 50: return maleWord; //Swain
            case 51: return femaleWord; //Caitlyn
            case 53: return maleWord; //Blitzcrank
            case 54: return maleWord; //Malphite
            case 55: return femaleWord; //Katarina
            case 56: return maleWord; //Nocturne
            case 57: return maleWord; //Maokai
            case 58: return maleWord; //Renekton
            case 59: return maleWord; //Jarvan IV
            case 60: return femaleWord; //Elise
            case 61: return femaleWord; //Orianna
            case 62: return maleWord; //Wukong
            case 63: return maleWord; //Brand
            case 64: return maleWord; //Lee Sin
            case 67: return femaleWord; //Vayne
            case 68: return maleWord; //Rumble
            case 69: return femaleWord; //Cassiopeia
            case 72: return maleWord; //Skarner
            case 74: return maleWord; //Heimerdinger
            case 75: return maleWord; //Nasus
            case 76: return femaleWord; //Nidalee
            case 77: return maleWord; //Udyr
            case 78: return femaleWord; //Poppy
            case 79: return maleWord; //Gragas
            case 80: return maleWord; //Pantheon
            case 81: return maleWord; //Ezreal
            case 82: return maleWord; //Mordekaiser
            case 83: return maleWord; //Yorick
            case 84: return femaleWord; //Akali
            case 85: return maleWord; //Kennen
            case 86: return maleWord; //Garen
            case 89: return femaleWord; //Leona
            case 90: return maleWord; //Malzahar
            case 91: return maleWord; //Talon
            case 92: return femaleWord; //Riven
            case 96: return maleWord; //Kog'Maw
            case 98: return maleWord; //Shen
            case 99: return femaleWord; //Lux
            case 101: return maleWord; //Xerath
            case 102: return femaleWord; //Shyvana
            case 103: return femaleWord; //Ahri
            case 104: return maleWord; //Graves
            case 105: return maleWord; //Fizz
            case 106: return maleWord; //Volibear
            case 107: return maleWord; //Rengar
            case 110: return maleWord; //Varus
            case 111: return maleWord; //Nautilus
            case 112: return maleWord; //Viktor
            case 113: return maleWord; //Sejuani
            case 114: return femaleWord; //Fiora
            case 115: return maleWord; //Ziggs
            case 117: return femaleWord; //Lulu
            case 119: return maleWord; //Draven
            case 120: return maleWord; //Hecarim
            case 121: return maleWord; //Kha'Zix
            case 122: return maleWord; //Darius
            case 126: return maleWord; //Jayce
            case 127: return femaleWord; //Lissandra
            case 131: return femaleWord; //Diana
            case 133: return femaleWord; //Quinn
            case 134: return femaleWord; //Syndra
            case 136: return maleWord; //Aurelion Sol
            case 143: return femaleWord; //Zyra
            case 150: return maleWord; //Gnar
            case 154: return maleWord; //Zac
            case 157: return maleWord; //Yasuo
            case 161: return maleWord; //Vel'Koz
            case 201: return maleWord; //Braum
            case 202: return maleWord; //Jhin
            case 203: return femaleWord; //Kindred
            case 222: return femaleWord; //Jinx
            case 223: return maleWord; //Tahm Kench
            case 236: return maleWord; //Lucian
            case 238: return maleWord; //Zed
            case 245: return maleWord; //Ekko
            case 254: return femaleWord; //Vi
            case 266: return maleWord; //Aatrox
            case 267: return femaleWord; //Nami
            case 268: return maleWord; //Azir
            case 412: return maleWord; //Thresh
            case 420: return femaleWord; //Illaoi
            case 421: return femaleWord; //Rek'Sai
            case 429: return femaleWord; //Kalista
            case 432: return maleWord; //Bard
        }

        return maleWord + '/' + femaleWord;
    }
})();