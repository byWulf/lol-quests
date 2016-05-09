import { SummonerManager } from '../../../services/summonerManager';

Template.summoner.events({
    'click #refreshNowButton': function(event, template) {
        template.refreshing.set(true);
        SummonerManager.refreshSummoner(function() {
            template.refreshing.set(false);
        });
    }
});

Template.summoner.onCreated(function() {
    this.refreshing = new ReactiveVar(false);
});

Template.summoner.helpers({
    refreshing: function() {
        return Template.instance().refreshing.get();
    }
});

Router.route('/region/:region/summoner/:name', {
    name: 'summoner.show',
    waitOn: function() {
        if (Tracker.currentComputation.firstRun) {
            SummonerManager.loadSummoner(this.params.region, this.params.name, function(error, result) {
                if (error) {
                    SummonerManager.chooseSummonerError.set(error.reason);
                    Router.go('/');
                } else {
                    Session.setPersistent('summonerValid', true);
                    Session.setPersistent('summonerName', result.summonerData.name);
                }
            });
        }
        return [
            function() { return SummonerManager.summoner.get(); }
        ]
    },
    loadingTemplate: 'loading',
    action: function() {
        this.render('summoner', {
            data: function() {
                return SummonerManager.summoner.get();
            }
        });
    }
});