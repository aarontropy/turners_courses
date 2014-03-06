
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


// ==== ADMIN SESSION EDIT =====================================================
Template.adminSessionEdit.events({
    'click #btnAddCourse': function(event) {
        insertCourse({title: 'New Course', session_id: this.session._id });
        // Session.set('showAddCourse', true);
    },
    'click .btnEditCourse': function(event) {
        Router.go('adminCourseEdit', {_id: this._id});
    },
    'click .btnDeleteCourse': function(event) {
        if(confirm("Remove " + this.title + "?")) {
            Courses.remove(this._id);
        }
    },
    'click #btnSaveSession': function(event, tmpl) {
        Sessions.update(this.session._id, {$set: {
            title: tmpl.find('input#sessionTitle').value,
            startDate: tmpl.find('input#sessionStartDate').value
        }})
    }
});

Template.adminSessionEdit.rendered = function() {
    $('#calendar').fullCalendar({
        dayClick: function( date, allDay, jsEvent, view) {

        },

        eventClick: function(calEvent, jsEvent, view) {

        },
        events: function(start, end, callback) {
            var courses = Courses.find();
            var meetings = [];
            courses.forEach(function(course) {
                meetings = meetings.concat(courseMeetings(course));
            });
            callback(meetings);
        },
    })
}


// ==== ADMIN COURSE EDIT ======================================================
Template.adminCourseEdit.helpers({
    meetings: function() {
        return courseMeetings(this.course);
    }
})

Template.adminCourseEdit.events({
    'click .saveCourse': function(event, tmpl) {
        var startDate = tmpl.find('input#courseStartDate').value;
        var course = {
            title: tmpl.find('input#courseTitle').value,
            startDate: (startDate) ? moment(startDate): undefined,
            instructor: tmpl.find('input#courseInstructor').value,
            shortDescription: tmpl.find('textarea#courseShortDescription').value,
            rule: {
                days: [
                    tmpl.find('input#courseSun').checked,
                    tmpl.find('input#courseMon').checked,
                    tmpl.find('input#courseTue').checked,
                    tmpl.find('input#courseWed').checked,
                    tmpl.find('input#courseThu').checked,
                    tmpl.find('input#courseFri').checked,
                    tmpl.find('input#courseSat').checked,
                ],
                count: tmpl.find('input#courseCount').value,
                startTime: tmpl.find('input#courseStartTime').value,
                duration: Number(tmpl.find('input#courseDuration').value),
            },
        };
        Courses.update(this.course._id, {$set: course});
    }
})


Template.adminCourseEdit.rendered = function() {
    $('#calendar').fullCalendar({
        dayClick: function( date, allDay, jsEvent, view) {

        },

        eventClick: function(calEvent, jsEvent, view) {

        },
        events: function(start, end, callback) {
            var course = Courses.findOne();
            var meetings = courseMeetings(course);
            callback(meetings);
        },
    })
}


// ==== COURSE MEETING FORM ====================================================
Template.courseMeetingsEditForm.helpers({
    isChecked: function(course, dayIdx) {
        return (course.rule && course.rule.days[dayIdx]) ? "checked" : "";
    }
})

