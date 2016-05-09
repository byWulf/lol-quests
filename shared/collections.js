/**
 * Mongo Collections
 */
Summoners = new Mongo.Collection('summoners');
Champions = new Mongo.Collection('champions');
Versions = new Mongo.Collection('versions');

/**
 * Static regions array
 */
Regions = {
    na: 'NA',
    euw: 'EUW',
    eune: 'EUNE',
    br: 'BR',
    jp: 'JP',
    kr: 'KR',
    lan: 'LAN',
    las: 'LAS',
    oce: 'OCE',
    ru: 'RU',
    tr: 'TR'
};