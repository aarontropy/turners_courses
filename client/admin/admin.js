
Template.adminUserTable.helpers({
    users: function() {
        return Meteor.users.find();
    }
})


Template.adminUserEdit.helpers({
    checkedIfInRole: function(user,role) {
        return (Roles.userIsInRole(user._id, [role])) ? "checked" : "";
    }
});
Template.adminUserEdit.events({
    'click .saveUser': function(event, tmpl) {
        // Add roles to user
        // Roles.setUserRoles will replace any currently set roles
        var roles = []
        _.each(tmpl.findAll('.inRole:checked'), function(role) {
            roles.push(role.value);
        });
        Roles.setUserRoles(this.targetUser, roles);
    }
})