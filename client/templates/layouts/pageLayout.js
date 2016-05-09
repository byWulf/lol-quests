Template.pageLayout.helpers({
    isCurrentRoute: function(routeName) {
        return Router.current().route.getName() == routeName;
    },
    summonerRouteData: function() {
        if (!Session.get('summonerValid')) return null;

        return {
            region: Session.get('summonerRegion').toLowerCase(),
            name: Session.get('summonerName').toLowerCase()
        }
    }, 
    summonerName: function() {
        return Session.get('summonerName');
    }
});