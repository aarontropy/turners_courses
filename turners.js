Sessions = new Meteor.Collection("sessions");
Courses = new Meteor.Collection("courses");

if (Meteor.isServer) {
    Meteor.startup(function() {
        if (Sessions.find().count() == 0) {
            for (var i=0; i<4; i++) {
                Sessions.insert({title: "Test Session " + i});
            }
        }
    });


    Meteor.publish("sessions", function() {
        return Sessions.find();
    });
    Meteor.publish("session", function(id) {
        return Sessions.find({_id: id });
    })
    Meteor.publish("sessionCourses", function(sessionId) {
        return Courses.find({session_id: sessionId});
    })

}


if (Meteor.isClient) {
    // ---- SessionList --------------------------------------------------------
    Template.sessionList.helpers({
        sessions: function() { return Sessions.find(); }
    })

    // ---- SessionDetail ------------------------------------------------------

    Template.sessionDetail.helpers({
        session: function() { return Sessions.findOne(); },
        courses: function() { return Courses.find(); }
    })
    Template.sessionDetail.events = {
        'click #addCourse': function() {
            alert('adding course');
        },
    }


    Template.courseEdit.events = {
        'click #saveCourse': function() {
            if (this.session) {
                Courses.insert({
                    title: $('#courseTitle').val(),
                    session_id: this.session._id,
                })
                Router.go('sessionDetail', {_id: this.session._id});
            }
        }
    }

    // ---- ClassEdit ----------------------------------------------------------
    // Template.courseEdit.helpers({
    //     course: function() { return Courses.findOne(); }
    // });

}