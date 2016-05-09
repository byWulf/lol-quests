import { SummonerManager } from '../../../services/summonerManager';

Template.index.events({
    'submit #chooseSummonerForm': function(e, template) {
        var region = template.region.get();
        var name = $(e.target).find('#summonerName').val();

        if (!name) {
            $(e.target).find('#summonerName').focus();
            return false;
        }
        
        SummonerManager.chooseSummonerError.set(null);
        Session.setPersistent('summonerValid', false);
        Session.setPersistent('summonerRegion', region);
        Session.setPersistent('summonerName', name);
        
        Router.go('summoner.show', {region: region.toLowerCase(), name: name.toLowerCase()});

        return false;
    },
    'click .regionOption': function(e, template) {
        template.region.set($(e.target).attr('data-value'));
        $(e.target).closest('form').find('#summonerName').focus();
    }
});

Template.index.onCreated(function() {
    this.region = new ReactiveVar(Session.get('summonerRegion') || 'na');
});

Template.index.helpers({
    regions: function() {
        var regions = [];
        for (var region in Regions) regions.push({regionCode: region, regionText: Regions[region]});
        return regions;
    },
    currentRegionText: function() {
        return Regions[Template.instance().region.get()];
    },
    isCurrentRegion: function(region) {
        return Template.instance().region.get() == region; 
    },
    summonerName: function() {
        return Session.get('summonerName');
    },
    error: function() {
        return SummonerManager.chooseSummonerError.get();
    }
});

Router.route('/', {
    name: 'index',
    action: function() {
      this.render('index');
    }
});