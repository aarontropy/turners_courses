// ==== ADMIN COURSE EDIT ======================================================
Template.adminCourseEdit.helpers({
    meetings: function() {
        return courseRRule(this.course).all();
    }
})

Template.adminCourseEdit.events({
    'click .saveCourse': function(event, tmpl) {
        course = {
            title: tmpl.find('input#courseTitle').value,
            startDate: tmpl.find('input#courseStartDate').value,
            instructor: tmpl.find('input#courseInstructor').value,
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
                weeks: tmpl.find('input#courseWeeks').value,
            },
        };
        console.log(this.course);
        console.log(course);
        Courses.update(this.course._id, {$set: course});
    },
    'click #btnMeetings': function(event) {
        rule = courseRRule(this.course);

        console.log(rule)
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
            console.log
            callback(meetings);
        },
    })
}


// ==== COURSE MEETING FORM ====================================================
Template.courseMeetingsEditForm.helpers({
    isChecked: function(course, dayIdx) {
        return course.rule.days[dayIdx] ? "checked" : "";
    }
})