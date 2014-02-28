
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
    Meteor.publish("courseWithSession", function(id) {
        // the naive approach is good enough here
        var courseCursor = Courses.find({_id: id});
        var session_id = Courses.findOne({_id: id}).session_id;
        return [
            courseCursor, 
            Sessions.find({_id: session_id})
        ];
    })

}


if (Meteor.isClient) {
    // ---- SessionList --------------------------------------------------------

    // ---- SessionDetail ------------------------------------------------------

    

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