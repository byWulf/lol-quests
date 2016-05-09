import { SummonerManager } from '../../../services/summonerManager';

Template.questBlock.events({
    'click .cancelQuestButton': function(event, template) {
        template.refreshing.set(true);
        SummonerManager.cancelQuest(function() {
            template.refreshing.set(false);
        });
    },
    'webkitAnimationEnd .dailyQuest, mozAnimationEnd .dailyQuest, MSAnimationEnd .dailyQuest, oanimationend .dailyQuest, animationend .dailyQuest': function(event, template) {
        template.data.effect = null;
        template.effectDependency.changed();
    }
});

Template.questBlock.onCreated(function() {
    this.refreshing = new ReactiveVar(false);
    this.effectDependency = new Deps.Dependency;
});

Template.questBlock.helpers({
    effect: function() {
        Template.instance().effectDependency.depend();
        return Template.instance().data.effect;
    },
    refreshing: function() {
        return Template.instance().refreshing.get();
    },
    isState: function(state) {
        return Template.instance().data.state == state;
    }
});