Semesters = new Meteor.Collection("semesters");
Semesters.allow({
    update: function() {
        return true;
    }
})
Semesters.toggleLock = function(s_id) {
    var locked = Semesters.findOne
    Semesters.update(s_id, {locked: true});
}
Semesters.activateSemester = function(s_id) {
    Meteor.call('activateSemester', s_id);
}

