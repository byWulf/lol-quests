var timeTick = new Tracker.Dependency();
Meteor.setInterval(function() {
    timeTick.changed();
}, 1000);

var fromNowReactive = function(date) {
    timeTick.depend();
    return moment(date).fromNow();
};
Template.registerHelper('fromNow', function(date) {
    return fromNowReactive(date);
});

var elapsedReactive = function(date, value, unit) {
    timeTick.depend();
    return moment().subtract(value, unit).diff(date) >= 0;
};
Template.registerHelper('hasElapsed', function(date, value, unit) {
    return elapsedReactive(date, value, unit);
});

var remainingTime = function(date, value, unit) {
    timeTick.depend();

    var diff = moment(date).add(value, unit).diff(moment());
    if (diff < 0) diff = 0;

    var hours = Math.floor(diff / 3600000);
    var minutes = Math.floor((diff - hours * 3600000) / 60000);
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' h';
};
Template.registerHelper('remainingTime', function(date, value, unit) {
    return remainingTime(date, value, unit);
});